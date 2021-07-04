import { RankerService } from "../";

describe("ranker service", () => {
  it("ranks correctly", () => {
    const rank = RankerService.rank({
      participants: 32,
      claps: 160,
      duration: 600,
    });

    expect(rank).toEqual(1.2604231007071627);
  });
});
