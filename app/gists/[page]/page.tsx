import { getGists } from "lib/fetcher";
import { notFound } from "next/navigation";
import FileContent from "../file-content";
import Pagination from 'components/rua/rua-pagination';

export const revalidate = 600;

export default async function Page({params}: {
  params: {
    page: string
  }
}) {
  const page = Number(params.page)
  if (!page) notFound()
  const gists = await getGists(page);
  if (!gists) notFound();

  const prev = Number(gists.pageSize.prev);
  const next = Number(gists.pageSize.next);
  const total = Number(gists.pageSize.last);

  return (
    <>
      <FileContent gists={gists.gists} />
      <Pagination
        className="mt-4"
        hasPrev={!!prev}
        hasNext={!!next}
        prevLink={prev === 1 ? `/gists/` : `/gists/${prev}`}
        nextLink={`/gists/${next}`}
        current={prev == null ? next - 1 : prev + 1}
        total={total}
      />
    </>
  );

}
