import prismadb from "@/lib/prismadb";
import CompanionForm from "./components/companion-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";

// Define a props type for the CompanionIdPage component containing a params object
// that holds the companionId as a string.
interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

/**
 * The CompanionIdPage component fetches and displays the companion data for editing.
 * It requires the companionId to be passed via props for identifying the correct record.
 *
 * @param {CompanionIdPageProps} props - The props object containing route parameters.
 * @returns React component that represents a page displaying the CompanionForm with initial data.
 */
const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
  // Retrieve the current authenticated user's ID from the auth helper.
  const { userId } = auth();

  // TODO: Add logic to check if the current user has an active subscription.

  // If there is no authenticated user ID, redirect the user to the sign-in page.
  if (!userId) {
    return redirectToSignIn();
  }

  // Fetch the unique companion data for the current user using Prisma client.
  // The query includes both the companion's ID and the current user's ID to ensure
  // only the creator of the companion data is authorized to view and edit it.
  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      userId: userId,
    },
  });

  // Fetch all category data to be used in the companion form's category selection.
  const categories = await prismadb.category.findMany();

  return <CompanionForm initialData={companion} categories={categories} />;
};

export default CompanionIdPage;
