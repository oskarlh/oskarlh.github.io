const latestCmathJs = fetch(Object.values((await (await fetch("https://registry.npmjs.org/cmath-js")).json()).versions).pop().dist.tarball, { cache: "no-store" });
