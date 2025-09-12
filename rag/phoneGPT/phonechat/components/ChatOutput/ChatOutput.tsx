"use client"
import React, { Children } from 'react';
import type { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
interface ChatOutputProps{
    messages: Message[];
    status:string;
}

const UserChat = ({content}:{content:string}) =>{
    return (
        <div className="bg-muted rounded-2xl ml-auto max-w-[80%] w-fit px-3 py-2 mb-6">{content}</div>
    )
} 
const AssistantChat = ({content, status}:{content:string, status:string}) =>{
    return (
        <div className="pr-8 w-full mb-6 ">
            <ReactMarkdown
             components = {{
                a:({children,href})=>(
                    <a target='_blank' href={href} className=' text-blue-500 underline'>{children}</a>
                )
             }}
            >{content}</ReactMarkdown>
             {
                status === 'submitted' && (
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                )
             }
             {
                status === 'error' && (
                    <div className="text-red-500">Error</div>
                )
             }
        </div>  
    )
}

const ChatOutput: React.FC<ChatOutputProps> = ({
    messages,
    status,
}) => {
    return (
        <div>
            {
                messages.map((message,index)=>
                message.role === 'user' ? (
                    <UserChat key ={index} content={message.content}/>
                ) : (
                    <AssistantChat key ={index} content={message.content} status={status} />
                )
                )
            }
        </div>
    )
}

export default ChatOutput;