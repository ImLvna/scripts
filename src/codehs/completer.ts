/// <reference lib="dom" />
/// <reference types="jquery" />

/*
 * This script will automatically complete all optional assignments on CodeHS.
 * It currently gets videos, free responses, examples, surveys, and resources.
 */

const modules = Array.from(
  document.querySelectorAll<HTMLAnchorElement>(".module-toggler")
);

const completableSelectors = [
  "video",
  "free-response",
  "example",
  "survey",
  "resource",
];

// some items are duplicated in the modules, so we need to keep track of what we've already done
const alreadyDone: string[] = [];

async function completeAll() {
  const items = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      completableSelectors
        .map((s) => `.${s}.unopened, .${s}.not-submitted`)
        .join(", ")
    )
  );

  for (const item of items) {
    try {
      if (alreadyDone.includes(item.href)) continue;

      // The id we need to submit the assignment is in the HTML of the page, so we need to fetch it
      const itemResponse = await fetch(item.href).then((r) => r.text());
      if (!itemResponse) throw new Error("Error fetching item");
      const assignmentId = itemResponse.match(
        /(?<=studentAssignmentID": )\d+(?=,)/
      )?.[0];

      if (!assignmentId) throw new Error("Error getting assignment id");

      const data = new FormData();
      data.append("student_assignment_id", assignmentId);
      data.append("method", "submit_assignment");

      const submit = await new Promise<{ status: "ok" | "fail" }>((res) => {
        $.ajax({
          url: "/lms/ajax/submit_assignment",
          type: "POST",
          data,
          processData: false,
          contentType: false,
          success: (data) => res(JSON.parse(data)),
        });
      });

      if (submit.status === "ok") {
        item.classList.remove("unopened");
        item.classList.add("reviewed");
      } else throw new Error("Error submitting item");
    } catch (e) {
      console.log("Error submitting item", item);
    }
    alreadyDone.push(item.href);
  }
}

let page = 0;
for (const module of modules) {
  page++;
  module.click();
  await new Promise((r) => setTimeout(r, 1000));
  await completeAll();
  console.log(`Completed page ${page}`);
}
console.log("Done!");
