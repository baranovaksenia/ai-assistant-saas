"use client";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";

import qs from "query-string";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // extract the categoryId and name from the search params
  const categoryId = searchParams.get("categoryId");
  const name = searchParams.get("name");

  // initialize a state variable to manage the search input value
  const [searchInput, setSearchInput] = useState(name || "");

  // debounce the search input to avoid spamming the server with requests
  // the debounceValue will only change after 500ms of inactivity
  const debounceValue = useDebounce(searchInput, 500);

  // when the debounceValue changes, update the search params
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const query = {
      name: debounceValue,
      categoryId: categoryId,
    };
    // stringify the query object and replace the current search params
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query: query,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  }, [debounceValue, categoryId, router]);

  return (
    <div className="relative">
      <Search className="absolute w-4 h-4 top-3 left-4 text-muted-foreground" />
      <Input
        value={searchInput}
        onChange={onChange}
        placeholder="Search..."
        className="pl-10 bg-primary/10"
      />
    </div>
  );
};

export default SearchInput;
