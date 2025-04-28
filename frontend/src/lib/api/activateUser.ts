'use server';

type Values = {
  uid: string;
  token: string;
};
async function activateUser(values: Values) {
  const { uid, token } = values;

  const res = await fetch(process.env.API_URL + '/api/users/activation/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ uid, token }),
  });
  console.log(res);
  const json = await res.json();
  console.log(json);
}

export { activateUser };
