import '@catppuccin/highlightjs/sass/catppuccin-variables.scss';
import GistsCode from 'components/pages/gists/gists-code';
import { getSignalGist } from 'lib/fetcher';

const GistCode = async ({ id }: { id: string }) => {
  const gist = await getSignalGist(id);

  if (!gist?.files) {
    return <div>Error</div>;
  }

  return (
    <div>
      {Object.keys(gist.files).map((f) => (
        <GistsCode
          key={gist.files[f].raw_url}
          file={gist.files[f]}
          showFileName
        />
      ))}
    </div>
  );
};

export default GistCode;
