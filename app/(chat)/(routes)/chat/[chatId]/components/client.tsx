"use client";
import ChatHeader from "@/components/chat-header";
import { useCompletion } from "ai/react";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import ChatForm from "@/components/chat-form";
import ChatMessages from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";

// Define interface for props expected by the ChatClient component
interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

const ChatClient = ({ companion }: ChatClientProps) => {
  const router = useRouter();
  // State to store messages with initial value from companion object
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages
  );

  // Destructuring methods and state from useCompletion hook
  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${companion.id}`, // API endpoint that handles completions for the chat
      // Callback fired upon completing an API request.
      // It takes the initial prompt and its completion
      onFinish(prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion, // Use the AI-generated completion as content
        };

        // Update messages to include new system message
        setMessages(current => [...current, systemMessage]);
        setInput(""); // Reset input field

        router.refresh(); // Refresh the current page (router navigation)
      },
    });

  // Handle form submit event
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user", // Identify message as from the user
      content: input, // Use the user input as content
    };
    // Update messages to include the new user message
    setMessages(current => [...current, userMessage]);

    // Invoke the handleSubmit method from the useCompletion hook, passing the event
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ChatClient;
