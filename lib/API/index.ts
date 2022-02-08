import { SearchType } from 'lib/API/types';

const search = async (q: string, page = 1) => {
  const body = {
    q,
    page,
  };

  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const result: SearchType = await response.json();
    return result;
  }
};

export { search };
