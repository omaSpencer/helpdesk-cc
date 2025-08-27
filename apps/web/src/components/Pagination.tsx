import { useSearchParams } from "react-router-dom";

type Props = {
  page: number;
  totalPages: number;
};

export function Pagination({ page, totalPages }: Props) {
  const [params, setParams] = useSearchParams();

  function go(p: number) {
    params.set("page", String(p));
    setParams(params, { replace: true });
  }

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
      <button disabled={page <= 1} onClick={() => go(page - 1)}>
        Prev
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button disabled={page >= totalPages} onClick={() => go(page + 1)}>
        Next
      </button>
    </div>
  );
}
