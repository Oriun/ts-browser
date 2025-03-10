console.log("transpileWorker");
import ts from "https://esm.sh/typescript@5.8.2";
import { addPathToUrl } from "https://oriun.github.io/ts-browser/UrlPathResolver_sideEffects.js";
import { ParseTsModule_sideEffects } from "https://oriun.github.io/ts-browser/actions/ParseTsModule_sideEffects.js";

const main = () => {
  const onmessage = (evt) => {
    const { data } = evt;
    const { messageType, messageData, referenceId } = data;
    if (messageType === "parseTsModule") {
      const { isJsSrc, staticDependencies, dynamicDependencies, getJsCode } =
        ParseTsModule_sideEffects({
          ...messageData,
          ts: ts,
          addPathToUrl: addPathToUrl,
        });
      self.postMessage({
        messageType: "parseTsModule_deps",
        messageData: { isJsSrc, staticDependencies, dynamicDependencies },
        referenceId: referenceId,
      });
      const jsCode = getJsCode();
      self.postMessage({
        messageType: "parseTsModule_code",
        messageData: { jsCode },
        referenceId: referenceId,
      });
    }
  };

  self.onmessage = (evt) => {
    try {
      onmessage(evt);
    } catch (exc) {
      console.error(exc);
      self.postMessage({
        messageType: "error",
        messageData: {
          message: exc.message,
          stack: exc.stack,
        },
        referenceId: ((evt || {}).data || {}).referenceId,
      });
    }
  };
};

try {
  console.log("ready");
  main();
  self.postMessage({
    messageType: "ready",
  });
} catch (exc) {
  console.error(exc);
  self.postMessage({
    messageType: "error",
    messageData: {
      message: "Failed to initialize worker - " + exc,
      stack: exc.stack,
    },
  });
}
