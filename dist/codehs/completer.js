async function C(){const k=Array.from(document.querySelectorAll(B.map((f)=>`.${f}.unopened, .${f}.not-submitted`).join(", ")));for(let f of k){try{if(v.includes(f.href))continue;const w=await fetch(f.href).then((j)=>j.text());if(!w)throw new Error("Error fetching item");const q=w.match(/(?<=studentAssignmentID": )\d+(?=,)/)?.[0];if(!q)throw new Error("Error getting assignment id");const h=new FormData;if(h.append("student_assignment_id",q),h.append("method","submit_assignment"),(await new Promise((j)=>{$.ajax({url:"/lms/ajax/submit_assignment",type:"POST",data:h,processData:!1,contentType:!1,success:(z)=>j(JSON.parse(z))})})).status==="ok")f.classList.remove("unopened"),f.classList.add("reviewed");else throw new Error("Error submitting item")}catch(w){console.log("Error submitting item",f)}v.push(f.href)}}var A=Array.from(document.querySelectorAll(".module-toggler")),B=["video","free-response","example","survey","resource"],v=[],x=0;for(let k of A)x++,k.click(),await new Promise((f)=>setTimeout(f,1000)),await C(),console.log(`Completed page ${x}`);console.log("Done!");
