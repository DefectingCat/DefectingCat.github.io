import '@catppuccin/highlightjs/sass/catppuccin-variables.rgb.scss';
import clsx from 'clsx';
import CopyCode from 'components/post/copy-code';
import { memo } from 'react';
import * as prod from 'react/jsx-runtime';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { GistsFile } from 'types';
import { unified } from 'unified';
import styles from './gists-code.module.css';

interface Props {
  file: GistsFile;
  showFileName?: boolean;
}

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

/**
 * Render GitHub gists code.
 *
 * @params file
 * @params showaFileName determine show full content or not
 */
const GistsCode = ({ file, showFileName = false }: Props) => {
  const fileContent = showFileName
    ? file.content
    : file.content?.split('\n').slice(0, 20).join('\n');
  const code = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(rehypeHighlight)
    .use(rehypeReact, production)
    .processSync(`\`\`\`${file.language ?? ''}\n${fileContent}`).result;

  return (
    <>
      {showFileName ? (
        <div className={clsx(styles.wrapper, 'relative group')}>
          <div className="h-[30px] bg-[#f6f8fa] dark:bg-[hsl(220,13%,18%)] flex">
            <div className="flex items-center h-full mx-3">
              <div
                className={clsx(
                  'box-border inline-block',
                  'w-[13px] h-[13px] mr-2',
                  'rounded-full bg-[#ce5347]',
                )}
              ></div>
              <div
                className={clsx(
                  'box-border inline-block',
                  'w-[13px] h-[13px] mr-2',
                  'rounded-full bg-[#d6a243]',
                )}
              ></div>
              <div
                className={clsx(
                  'box-border inline-block',
                  'w-[13px] h-[13px]',
                  'rounded-full bg-[#58a942]',
                )}
              ></div>
            </div>

            <div
              className={clsx(
                'px-4 bg-white',
                'leading-[30px]',
                'dark:bg-[hsl(220,13%,18%)] dark:border-b dark:border-b-[rgb(128,203,196)]',
                'overflow-hidden whitespace-nowrap overflow-ellipsis',
              )}
            >
              {file.filename}
            </div>
          </div>

          <div className="relative group">
            {code}
            <CopyCode />
          </div>
        </div>
      ) : (
        <div className="relative group">
          {code}
          <CopyCode />
        </div>
      )}
    </>
  );
};

export default memo(GistsCode);
