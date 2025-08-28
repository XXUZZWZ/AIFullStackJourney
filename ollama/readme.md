# ollama

[ollama](https://ollama.ai/)

它是一个能通过简单命令在本地下载运行和大语言模块，支持 GPU 加速和 OPENAI API
,适合本地部署和开发。

Meta Llama 羊驼
deepseek-r1 ：1.5b 参数的尺寸 1.5Billion
Qwen 7B ：7B 参数的尺寸 7Billion

在 localhost:11434 启动 提供 api 调用
下载地址
https://ollama.com/

启动命令

ollama run --list
ollama run deepseek-r1
ollama run qwen-7b

访问端口：

http://localhost:11434/api/chat

可以在run的时候设置端口吗？

可以的，你可以在启动ollama时设置参数。例如，你可以使用以下命令启动一个名为"deepseek-r1"的模型：
ollama run --list
ollama run deepseek-r1 --port 11434
启动命令中添加了--port参数，并指定了端口为11434。这样，Ollama将监听该端口，并等待API调用。



