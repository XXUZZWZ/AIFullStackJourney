// langchain loader 是RAG的基础功能 txt、pdf、excel...
// 加载网页内容
import {
  PuppeteerWebBaseLoader
} from '@langchain/community/document_loaders/web/puppeteer'
import {
  CheerioWebBaseLoader
} from '@langchain/community/document_loaders/web/cheerio'
import {
  RecursiveCharacterTextSplitter
} from 'langchain/text_splitter'
import { createOpenAI } from "@ai-sdk/openai"
import {
  embed // 向量嵌入
} from 'ai'
import { createClient } from '@supabase/supabase-js'
import {
  config
} from 'dotenv'
config()

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
)

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL
})

// supabase 去做向量化的知识库数据
console.log('开始向量化知识库数据')
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512, // 切割的长度  512个字符  包含一个比较独立的语义
  chunkOverlap: 100 // 切割的重叠长度  100个字符  一句话被切断容错
})
const scrapePage = async (url: string): Promise<string> => {
  // 首选 Puppeteer（处理动态站点），失败则回退到 Cheerio/fetch
  const tryScrapeWithPuppeteer = async (): Promise<string> => {
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: {
        headless: true,
      },
      gotoOptions: {
        waitUntil: 'networkidle0',
        timeout: 30000,
      },
      evaluate: async (page, browser) => {
        const result = await page.evaluate(() => document.body.innerHTML);
        await browser.close();
        return result;
      }
    });
    return await loader.scrape();
  }

  const tryScrapeWithCheerio = async (): Promise<string> => {
    const loader = new CheerioWebBaseLoader(url);
    return await loader.scrape();
  }

  const stripHtml = (html: string): string => html.replace(/<[^>]*>?/gm, '');

  // 重试 Puppeteer 2 次
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const html = await tryScrapeWithPuppeteer();
      return stripHtml(html);
    } catch (err) {
      if (attempt === 2) {
        console.warn(`Puppeteer scrape failed after ${attempt} attempts for ${url}. Falling back.`, err);
      } else {
        console.warn(`Puppeteer scrape attempt ${attempt} failed for ${url}. Retrying...`);
      }
    }
  }

  // 回退到 Cheerio（纯 HTTP 抓取）
  try {
    const html = await tryScrapeWithCheerio();
    return stripHtml(html);
  } catch (err) {
    console.warn(`Cheerio scrape failed for ${url}. Falling back to fetch.`, err);
  }

  // 最后回退到 fetch
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const html = await res.text();
    return stripHtml(html);
  } catch (err) {
    console.error(`All scraping methods failed for ${url}.`, err);
    return '';
  }
}
const loadData = async (webpages: string[]) => {
  for (const url of webpages) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    // console.log(chunks,'------')
    for (let chunk of chunks) {
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: chunk
      })
      // console.log(embedding,'------')

      const { error } = await supabase.from('chunks').insert({
        content: chunk,
        vector: embedding,
        url: url
      })
      if (error) {
        console.error("Error inserting chunk")
      }
    }
  }
}
// 知识库的来源，可配置
loadData([
  "https://en.wikipedia.org/wiki/Samsung_Galaxy_S25",
  // "https://en.wikipedia.org/wiki/Samsung_Galaxy_S24",
  // "https://en.wikipedia.org/wiki/IPhone_16",
  // "https://en.wikipedia.org/wiki/IPhone_16_Pro",
  // "https://en.wikipedia.org/wiki/IPhone_15",
  // "https://en.wikipedia.org/wiki/IPhone_15_Pro",
]);