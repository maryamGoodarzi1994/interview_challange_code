import { calculatePrimes } from "./lib.mjs";
import { Worker, isMainThread, parentPort } from "worker_threads";
import os from "os";

const end = 10000005;
let start = 1;
let workersCompleted = 0;

if (isMainThread) {
  const numThreads = os.cpus().length;
  const range = Math.floor(end / numThreads);
  let total = 0;

  for (let i = 0; i < numThreads; i++) {
    const worker = new Worker("./index.js");
    worker.postMessage({
      start,
      end: i === numThreads - 1 ? end : start + range - 1,
    });

    start += range;

    worker.on("message", (result) => {
      total += result;

      workersCompleted++;

      if (workersCompleted === numThreads) {
        console.log(`total is: ${total}`);
        process.exit();
      }
    });
  }
} else {
  parentPort.on("message", ({ start, end }) => {
    const result = calculatePrimes(start, end);
    console.log(
      `Start calculating the number of prime numbers between "${start}" ,"${end}"...`
    );

    parentPort.postMessage(result);
  });
}

const interval = setInterval(() => {
  console.log("Still calculating...");
}, 1000);
