/*
 * ClickBand Junior — AIImprover.js
 * Provides the optional asynchronous AI-improvement boundary and safe fallback to the original MIDI.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
"use strict";
(function (global) {
  









  function AIImprover(config) {
    this.config = config || {};
  }

  AIImprover.prototype.improve = function (midiBytes, onProgress) {
    var self = this;
    if (!midiBytes) {
      return Promise.reject(new Error("AIImprover: MIDI mancante."));
    }

    if (!self.config.enabled) {
      return Promise.resolve({
        midiBytes: midiBytes,
        engine: "disabled",
        changed: false,
        warning: null
      });
    }

    if (typeof global.cbRunAIImprovement !== "function") {
      return Promise.resolve({
        midiBytes: midiBytes,
        engine: "offline-fallback",
        changed: false,
        warning: "AI engine is unavailable. The original MIDI was preserved."
      });
    }

    return global.cbRunAIImprovement(
      midiBytes,
      self.config.temperature,
      onProgress
    ).then(function (improvedBytes) {
      if (!improvedBytes || !improvedBytes.length) {
        throw new Error("The AI engine did not return valid MIDI data.");
      }
      return {
        midiBytes: improvedBytes,
        engine: "magenta",
        changed: true,
        warning: null
      };
    }).catch(function (error) {
      return {
        midiBytes: midiBytes,
        engine: "offline-fallback",
        changed: false,
        warning: "AI improvement failed: " + error.message + ". The original MIDI was preserved."
      };
    });
  };

  global.AIImprover = AIImprover;
  global.MagentaEnhancer = AIImprover;
})(window);
