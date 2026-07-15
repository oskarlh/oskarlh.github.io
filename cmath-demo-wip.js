const { versions } = await (await fetch("https://registry.npmjs.org/cmath-js")).json();
const eightLatest = Object.values(versions).slice(-8);
await Promise.allSettled(eightLatest.map(({ dist: { tarball }}) => fetch(tarball, { cache: "no-store" })));
