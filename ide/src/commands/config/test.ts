import axios from 'axios';

export default async function test(server: string): Promise<boolean> {
  try {
    const resp = await axios.get(server);
    if (resp.status !== 200) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
};
