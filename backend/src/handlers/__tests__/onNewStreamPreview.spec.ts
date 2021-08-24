import { onNewStreamPreview } from "../onNewStreamPreview";
import { CandidateDAL } from "@backend/dal";

describe("onNewStreamPreview handler", () => {
  it("updates feed candidate", async () => {
    CandidateDAL.setPreviewClip = jest.fn();

    const stream = "test-stream";
    const preview = "test-preview";

    await onNewStreamPreview(
      {
        stream,
        preview,
      },
      jest.fn()
    );

    expect(CandidateDAL.setPreviewClip).toBeCalledWith(stream, preview);
  });
});
