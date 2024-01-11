import SearchInput from "@/components/SearchInput";
import Categories from "@/components/categories";
import Companions from "@/components/companions";
import prismadb from "@/lib/prismadb";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const data = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      // @db.Text - searchable field
      name: {
        search: searchParams.name,
      },
    },
    //  show the newest first
    orderBy: {
      createdAt: "desc",
    },
    // count how many messages companion has
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });
  //fetch the categories from the db (server component)
  const categories = await prismadb.category.findMany();
  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  );
};

export default RootPage;
