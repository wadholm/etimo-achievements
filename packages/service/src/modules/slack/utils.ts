import fetch from 'node-fetch';

export const showModal = async (view: any) => {
  const response = await fetch('https://slack.com/api/views.open', {
    method: 'POST',
    headers: getSlackHeaders(),
    body: view,
  });

  const content = await response.json();
  console.log(content);
};

export const getSlackHeaders = () => {
  return {
    'Content-type': 'application/json',
    Authorization: `Bearer ${process.env['SLACK_ACCESS_TOKEN']}`,
  };
};
