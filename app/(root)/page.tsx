import SearchInput from "@/components/SearchInput";
import Categories from "@/components/categories";
import prismadb from "@/lib/prismadb";

const HomePage = async () => {
  //fetch the categories from the db (server component)
  const categories = await prismadb.category.findMany();
  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
    </div>
  );
};

export default HomePage;
