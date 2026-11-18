import picomatch from "picomatch";

self.postMessage(picomatch("*.md")("README.md"));
