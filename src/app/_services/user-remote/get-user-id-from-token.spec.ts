import { getUserIdFromToken } from "./get-user-id-from-token";

describe('getUserIdFromToken', () => {
  let actualResult: any;
  const accessTokenWithUserIdOf2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsIm5hbWUiOiJGQUtFIFVTRVIiLCJpYXQiOjE1MTYyMzkwMjJ9.R51Wh-iafjESs9CI45tDVlBHEwSaWhwBcZqwH8NVw50';
  const expectedUserId = 2;

  When(() => {
    actualResult = getUserIdFromToken(accessTokenWithUserIdOf2);
  });

  Then(() => {
    expect(actualResult).toEqual(expectedUserId);
  });



});
