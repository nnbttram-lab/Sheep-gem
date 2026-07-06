/**
 * Generic form generator for editing window.SITE_CONTENT.
 * Walks the content object, renders inputs bound to each field's path,
 * and lets you download a regenerated content/site-content.js.
 */
(function () {
  const draft = JSON.parse(JSON.stringify(window.SITE_CONTENT || {}));
  const form = document.getElementById("content-form");

  function setAtPath(obj, path, value) {
    let node = obj;
    for (let i = 0; i < path.length - 1; i++) node = node[path[i]];
    node[path[path.length - 1]] = value;
  }

  function labelFor(key) {
    return String(key).replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").trim();
  }

  function renderPrimitive(container, value, path, key) {
    const row = document.createElement("div");
    row.className = "field-row";
    const label = document.createElement("label");
    label.textContent = labelFor(key);
    row.appendChild(label);

    const isLong = typeof value === "string" && value.length > 60;
    const input = document.createElement(isLong ? "textarea" : "input");
    if (!isLong) input.type = typeof value === "number" ? "number" : "text";
    input.value = value;
    input.addEventListener("input", () => {
      const v = typeof value === "number" ? Number(input.value) : input.value;
      setAtPath(draft, path, v);
    });
    row.appendChild(input);
    container.appendChild(row);
  }

  function renderNode(container, value, path, key) {
    if (Array.isArray(value)) {
      const fs = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = labelFor(key);
      fs.appendChild(legend);
      value.forEach((item, idx) => {
        const wrap = document.createElement("div");
        wrap.className = "array-item";
        const idxLabel = document.createElement("div");
        idxLabel.className = "array-item-index";
        idxLabel.textContent = `#${idx + 1}`;
        wrap.appendChild(idxLabel);
        renderObjectFields(wrap, item, path.concat(idx));
        fs.appendChild(wrap);
      });
      container.appendChild(fs);
    } else if (value !== null && typeof value === "object") {
      const fs = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = labelFor(key);
      fs.appendChild(legend);
      renderObjectFields(fs, value, path);
      container.appendChild(fs);
    } else {
      renderPrimitive(container, value, path, key);
    }
  }

  function renderObjectFields(container, obj, path) {
    Object.keys(obj).forEach((key) => {
      renderNode(container, obj[key], path.concat(key), key);
    });
  }

  renderObjectFields(form, draft, []);
  form.addEventListener("submit", (e) => e.preventDefault());

  // Live preview -------------------------------------------------------------
  const previewFrame = document.getElementById("preview-frame");
  let previewReady = false;

  function pushPreview() {
    if (!previewReady || !previewFrame.contentWindow) return;
    previewFrame.contentWindow.postMessage({ type: "SITE_CONTENT_UPDATE", payload: draft }, "*");
  }

  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SITE_PREVIEW_READY" && event.source === previewFrame.contentWindow) {
      previewReady = true;
      pushPreview();
    }
  });

  // In case the iframe already finished loading before the listener above
  // was attached (fast cache loads), also sync on the iframe's load event.
  previewFrame.addEventListener("load", () => {
    previewReady = true;
    pushPreview();
  });

  form.addEventListener("input", pushPreview);

  // Device width toggle --------------------------------------------------------
  document.querySelectorAll(".device-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".device-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      previewFrame.style.width = btn.dataset.width;
    });
  });

  document.getElementById("download-btn").addEventListener("click", () => {
    const json = JSON.stringify(draft, null, 2);
    const fileContent =
      "/**\n * SHEEP GEM — SITE CONTENT (edited via admin.html)\n */\n\nwindow.SITE_CONTENT = " +
      json +
      ";\n";
    const blob = new Blob([fileContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-content.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
})();
