import { XIcon, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Form, useFetcher, useSearchParams } from "react-router";
import { Input } from "~/common/components/ui/input";
import SortKeywordDropdownMenu from "./sort-keyword-dropdownmenu";
import OrderClassDropdownMenu from "../class/order-class-dropdownmenu";
import UrlResetButton from "../../utils/url-reset-button";

interface Keyword {
  keyword_frequency: number | null;
  keyword_id: number;
  keyword_text: string;
}

interface KeyWordSearchProps {
  keyword: Keyword[];
}

export default function KeyWordSearch({ keyword }: KeyWordSearchProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const stored = localStorage.getItem("search_keywords");
    if (stored) {
      setKeywords(JSON.parse(stored));
    }
  }, []);
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const keyword = formData.get("keyword") as string;
    fetcher.submit(formData, {
      method: "post",
      action: "/classes/keyword",
    });
    if (keyword && !keywords.includes(keyword)) {
      const updated = [...keywords, keyword];
      setKeywords(updated);
      localStorage.setItem("search_keywords", JSON.stringify(updated));
    }

    searchParams.set("keyword", keyword);
    setSearchParams(searchParams);
  };

  const removeKeyword = (keyword: string) => {
    const updated = keywords.filter((item) => item !== keyword);
    setKeywords(updated);
    localStorage.setItem("search_keywords", JSON.stringify(updated));
  };

  const handleKeywordClick = (keyword: string) => {
    searchParams.set("keyword", keyword);
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <SortKeywordDropdownMenu />
        <OrderClassDropdownMenu />
      </div>
      <div className="flex gap-3">
        <Form className="w-full" onSubmit={handleSearch} method="post">
          <Input
            type="text"
            name="keyword"
            placeholder="Search for Class"
            className="w-full"
          />
        </Form>
        <UrlResetButton />
      </div>

      {keywords.length > 0 && (
        <div className="text-sm text-gray-500">
          <ul className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <li
                key={index}
                className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-lg"
              >
                <button
                  onClick={() => handleKeywordClick(keyword)}
                  className="mr-2 hover:underline"
                >
                  {keyword}
                </button>
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <XIcon className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex gap-1 items-center mb-1">
        <span className="text-gray-400 text-sm">인기 검색어 Top 5</span>
        <TrendingUp className="size-4 bg-white text-gray-400 rounded" />
      </div>
      <div className="flex gap-3">
        {keyword.map((key) => (
          <div>
            <button
              onClick={() => handleKeywordClick(key.keyword_text)}
              className="hover:underline"
            >
              {key.keyword_text}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
