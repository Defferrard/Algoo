/** @type {import("./$types").PageServerLoad} */
export async function load({ params }: any) {
  let data = {
    uuid: params.uuid,
  };
  return data;
}
