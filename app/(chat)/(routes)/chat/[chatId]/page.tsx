import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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
