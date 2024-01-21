/**
 * Renders the page for a specific chat ID.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters object containing the chat ID.
 * @param {string} props.params.chatId - The ID of the chat.
 * @returns {JSX.Element} The rendered chat page.
 */
import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ChatClient from "./components/client";

interface ChatIdPageProps {
  params: {
    chatId: string;
  };
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatId,
    },
    // load messages just belongs to this current user
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId: userId,
        },
      },
      // show number of messages from all users
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });
  if (!companion) {
    return redirect("/");
  }

  return <ChatClient companion={companion} />;
};

export default ChatIdPage;
