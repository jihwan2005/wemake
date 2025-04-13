import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Form, useSearchParams } from "react-router";
import { Input } from "~/common/components/ui/input";

export default function KeyWordSearch() {
  const [keywords, setKeywords] = useState<string[]>([]);
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
      <Form className="w-full mb-5" onSubmit={handleSearch} method="post">
        <Input type="text" name="keyword" placeholder="Search for Class" />
      </Form>
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
    </div>
  );
}
