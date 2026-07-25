/*
 * ClickBand Junior — RhythmPatternLibrary.js
 * Provides reusable style-specific rhythmic patterns without DOM or MIDI dependencies.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
"use strict";

(function (global) {
  var PATTERNS = [
  {
    "sourceLine": 1,
    "style": "POP",
    "role": "i",
    "kick": "X---X---X-X-----",
    "snare": "----X-------X---",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "X---------------",
    "id": "pop_001",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 117,
    "style": "POP",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "--------X-------",
    "HH": "-X-X-X-----X-X--",
    "crash": "X---------------",
    "id": "pop_002",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 31,
    "style": "POP",
    "role": "i",
    "kick": "--X-------------",
    "snare": "X---X-X-X--XXXX-",
    "HH": "X---X---X-------",
    "crash": "X---------------",
    "id": "pop_003",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 32,
    "style": "POP",
    "role": "i",
    "kick": "X-----X---------",
    "snare": "----X-----X-X-X-",
    "HH": "X---X---X---X---",
    "crash": "X---------------",
    "id": "pop_004",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 121,
    "style": "POP",
    "role": "i",
    "kick": "X---X---X-------",
    "snare": "--------X-XXX---",
    "HH": "-X-X----------X-",
    "crash": "X---------------",
    "id": "pop_005",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 58,
    "style": "POP",
    "role": "i",
    "kick": "X-----X---------",
    "snare": "----X-------X---",
    "HH": "----X---X-X---X-",
    "crash": "X---------------",
    "id": "pop_006",
    "density": 0.141,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 15,
    "style": "POP",
    "role": "i",
    "kick": "X-----X---X---X-",
    "snare": "----X-------X---",
    "HH": "X---X---X---X---",
    "crash": "X---------------",
    "id": "pop_007",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 72,
    "style": "POP",
    "role": "i",
    "kick": "X-----X---------",
    "snare": "----X-------X---",
    "HH": "----X-X-X-X-X---",
    "crash": "X---------------",
    "id": "pop_008",
    "density": 0.156,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 53,
    "style": "POP",
    "role": "i",
    "kick": "X-----X---X-----",
    "snare": "----X-------X---",
    "HH": "X---X-X-X---X---",
    "crash": "X---------------",
    "id": "pop_009",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 61,
    "style": "POP",
    "role": "i",
    "kick": "X-----X---X-----",
    "snare": "----X-------X---",
    "HH": "----X---X---X---",
    "crash": "X---------------",
    "id": "pop_010",
    "density": 0.141,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 87,
    "style": "POP",
    "role": "c",
    "kick": "X-X---X-X-------",
    "snare": "--X-X--X-X--X---",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "pop_011",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 118,
    "style": "POP",
    "role": "c",
    "kick": "X---X---X---X--X",
    "snare": "--------X-XX-X--",
    "HH": "-X-X-X----------",
    "crash": "----------------",
    "id": "pop_012",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 80,
    "style": "POP",
    "role": "c",
    "kick": "X----X----X--X--",
    "snare": "----X-X-----X-X-",
    "HH": "X---X--X----X---",
    "crash": "----------------",
    "id": "pop_013",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 102,
    "style": "POP",
    "role": "c",
    "kick": "---------------X",
    "snare": "--------------XX",
    "HH": "---X-X--X-X-XX--",
    "crash": "----------------",
    "id": "pop_014",
    "density": 0.141,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 95,
    "style": "POP",
    "role": "c",
    "kick": "--------X-X---X-",
    "snare": "--------X---X---",
    "HH": "X---X---X--X---X",
    "crash": "----------------",
    "id": "pop_015",
    "density": 0.156,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 6,
    "style": "POP",
    "role": "c",
    "kick": "X-----X---------",
    "snare": "--------X-------",
    "HH": "X-XXX-X-X-XXX-XX",
    "crash": "----------------",
    "id": "pop_016",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 142,
    "style": "POP",
    "role": "c",
    "kick": "-X----X---X---X-",
    "snare": "-X--X-------X---",
    "HH": "X-X-X-X-X-X-X---",
    "crash": "----------------",
    "id": "pop_017",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 151,
    "style": "POP",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "--------X---X-X-",
    "HH": "X-X-X---X-X-X---",
    "crash": "----------------",
    "id": "pop_018",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 83,
    "style": "POP",
    "role": "c",
    "kick": "--X--X--X-------",
    "snare": "X---X---X---X--X",
    "HH": "X-X-X---X-X-X-X-",
    "crash": "----------------",
    "id": "pop_019",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 56,
    "style": "POP",
    "role": "c",
    "kick": "X---X-X-X-X-----",
    "snare": "--X-X---X-X-----",
    "HH": "X-X-X-X-X-X-X---",
    "crash": "----------------",
    "id": "pop_020",
    "density": 0.25,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 91,
    "style": "POP",
    "role": "c",
    "kick": "X---XX--XX--X---",
    "snare": "X---------------",
    "HH": "X---------------",
    "crash": "----------------",
    "id": "pop_021",
    "density": 0.125,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 96,
    "style": "POP",
    "role": "c",
    "kick": "--X---X-X-X-X-X-",
    "snare": "----X-----X-X---",
    "HH": "----X---X---X---",
    "crash": "----------------",
    "id": "pop_022",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 34,
    "style": "POP",
    "role": "c",
    "kick": "X-----X---------",
    "snare": "----X-----X-XXX-",
    "HH": "X---X---X---X---",
    "crash": "----------------",
    "id": "pop_023",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 109,
    "style": "POP",
    "role": "c",
    "kick": "X---------------",
    "snare": "--------X-------",
    "HH": "X--X-X-------X-X",
    "crash": "----------------",
    "id": "pop_024",
    "density": 0.109,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 108,
    "style": "POP",
    "role": "c",
    "kick": "-------XX-------",
    "snare": "------------XXXX",
    "HH": "-X-X-X-------X--",
    "crash": "----------------",
    "id": "pop_025",
    "density": 0.156,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 21,
    "style": "POP",
    "role": "c",
    "kick": "X--------X--X---",
    "snare": "----X-------X---",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "pop_026",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 76,
    "style": "POP",
    "role": "c",
    "kick": "X-X---X-X-----X-",
    "snare": "----X--X----X---",
    "HH": "X--X----X---X---",
    "crash": "----------------",
    "id": "pop_027",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 81,
    "style": "POP",
    "role": "c",
    "kick": "X-X--X--X-X-X-X-",
    "snare": "----X-X-----X-X-",
    "HH": "X---X---X---X---",
    "crash": "----------------",
    "id": "pop_028",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 132,
    "style": "POP",
    "role": "c",
    "kick": "X-X---X---X-----",
    "snare": "----X-----X-X---",
    "HH": "X---X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "pop_029",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 104,
    "style": "POP",
    "role": "c",
    "kick": "-X--X-----------",
    "snare": "--------X-------",
    "HH": "----X---X---X--X",
    "crash": "----------------",
    "id": "pop_030",
    "density": 0.109,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 122,
    "style": "POP",
    "role": "c",
    "kick": "--------X--X----",
    "snare": "------------X---",
    "HH": "----X--XX-X-X---",
    "crash": "----------------",
    "id": "pop_031",
    "density": 0.125,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 84,
    "style": "POP",
    "role": "c",
    "kick": "X-X---X-X-------",
    "snare": "-X--X-------X-X-",
    "HH": "X-X-X---X---X-X-",
    "crash": "----------------",
    "id": "pop_032",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 139,
    "style": "POP",
    "role": "c",
    "kick": "X-X---X---X---X-",
    "snare": "-X--XX------X--X",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "pop_033",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 123,
    "style": "POP",
    "role": "c",
    "kick": "XX----X---X-----",
    "snare": "-X--X-------X---",
    "HH": "XX--X---X---XX--",
    "crash": "----------------",
    "id": "pop_034",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 97,
    "style": "POP",
    "role": "c",
    "kick": "X-X-X-X-X-------",
    "snare": "--X-X-----------",
    "HH": "X---X---X-------",
    "crash": "----------------",
    "id": "pop_035",
    "density": 0.156,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 75,
    "style": "POP",
    "role": "c",
    "kick": "X-X---X---X-----",
    "snare": "----X-X-----X-X-",
    "HH": "X---X---X--X----",
    "crash": "----------------",
    "id": "pop_036",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 112,
    "style": "POP",
    "role": "c",
    "kick": "X---X---X--X---X",
    "snare": "-----------X----",
    "HH": "-X-X-X-X------X-",
    "crash": "----------------",
    "id": "pop_037",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 37,
    "style": "POP",
    "role": "c",
    "kick": "----------X-----",
    "snare": "--------XX--XX--",
    "HH": "----------------",
    "crash": "----------------",
    "id": "pop_038",
    "density": 0.078,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 64,
    "style": "POP",
    "role": "c",
    "kick": "X---------------",
    "snare": "X-X-X-X-X-------",
    "HH": "X---------------",
    "crash": "----------------",
    "id": "pop_039",
    "density": 0.109,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 119,
    "style": "POP",
    "role": "c",
    "kick": "----X---X---X---",
    "snare": "--------X--XX---",
    "HH": "-XX--X----------",
    "crash": "----------------",
    "id": "pop_040",
    "density": 0.141,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 134,
    "style": "POP",
    "role": "f",
    "kick": "X-X---X---X---X-",
    "snare": "XX--X--X-X--X---",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "pop_041",
    "density": 0.297,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 120,
    "style": "POP",
    "role": "f",
    "kick": "X---X---X---X---",
    "snare": "-X-X-X--X--X-XXX",
    "HH": "----------------",
    "crash": "----------------",
    "id": "pop_042",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 73,
    "style": "POP",
    "role": "f",
    "kick": "X---------------",
    "snare": "--X-X-X-XXXX----",
    "HH": "X-X-X-X---------",
    "crash": "----------------",
    "id": "pop_043",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 78,
    "style": "POP",
    "role": "f",
    "kick": "X----X--X-----X-",
    "snare": "-XXXX-------X-X-",
    "HH": "X--X----X---X---",
    "crash": "----------------",
    "id": "pop_044",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 106,
    "style": "POP",
    "role": "f",
    "kick": "----XX----------",
    "snare": "XX----XXXX-XXXXX",
    "HH": "-X---X---X--X---",
    "crash": "----------------",
    "id": "pop_045",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 60,
    "style": "POP",
    "role": "f",
    "kick": "X-X-X-X---------",
    "snare": "--X-X-X-X-XXXXX-",
    "HH": "X-------X-------",
    "crash": "----------------",
    "id": "pop_046",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 52,
    "style": "POP",
    "role": "f",
    "kick": "X-----X---------",
    "snare": "----X--X-XXXXXX-",
    "HH": "X-X-X-X-X-X-X---",
    "crash": "----------------",
    "id": "pop_047",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 141,
    "style": "POP",
    "role": "f",
    "kick": "--X---X---X--X-X",
    "snare": "-X--X--X-X--XX--",
    "HH": "X-X-X---XX--X---",
    "crash": "----------------",
    "id": "pop_048",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 36,
    "style": "POP",
    "role": "f",
    "kick": "----------------",
    "snare": "XX---X---XXXX---",
    "HH": "----X-----------",
    "crash": "----------------",
    "id": "pop_049",
    "density": 0.125,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 85,
    "style": "POP",
    "role": "f",
    "kick": "X-X---X-X-------",
    "snare": "-X--X---X-X-X--X",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "pop_050",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 77,
    "style": "ROCK",
    "role": "i",
    "kick": "X-------X-XX----",
    "snare": "----X--X-X--X--X",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "X---------------",
    "id": "rock_001",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 149,
    "style": "ROCK",
    "role": "i",
    "kick": "XX-X------------",
    "snare": "--------X-------",
    "HH": "-X-XXX-X-X-XXXX-",
    "crash": "X---------------",
    "id": "rock_002",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 79,
    "style": "ROCK",
    "role": "i",
    "kick": "--X----X--X-----",
    "snare": "X--XXX--X--XXX--",
    "HH": "--X---X-X-X-X---",
    "crash": "X---------------",
    "id": "rock_003",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 1,
    "style": "ROCK",
    "role": "i",
    "kick": "X---X-X-X-------",
    "snare": "----X-------X---",
    "HH": "XXXXXXXXXXXXXXXX",
    "crash": "X---------------",
    "id": "rock_004",
    "density": 0.359,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 91,
    "style": "ROCK",
    "role": "i",
    "kick": "X--X------------",
    "snare": "----XXXX--------",
    "HH": "----------------",
    "crash": "X---------------",
    "id": "rock_005",
    "density": 0.109,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 63,
    "style": "ROCK",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "----------------",
    "HH": "---XXX-XXX-XXX-X",
    "crash": "X---------------",
    "id": "rock_006",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 27,
    "style": "ROCK",
    "role": "i",
    "kick": "X-X-------------",
    "snare": "--------X-------",
    "HH": "--X-XXX--X-XXX-X",
    "crash": "X---------------",
    "id": "rock_007",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 82,
    "style": "ROCK",
    "role": "i",
    "kick": "X-------X-XX--X-",
    "snare": "----X--X-X--X--X",
    "HH": "----------------",
    "crash": "X---------------",
    "id": "rock_008",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 109,
    "style": "ROCK",
    "role": "i",
    "kick": "X-----X---X-----",
    "snare": "----X-------X---",
    "HH": "X---X---X-X-X-X-",
    "crash": "X---------------",
    "id": "rock_009",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 26,
    "style": "ROCK",
    "role": "i",
    "kick": "X---------------",
    "snare": "--------X-------",
    "HH": "---XXX-X-X-XXX-X",
    "crash": "X---------------",
    "id": "rock_010",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 80,
    "style": "ROCK",
    "role": "i",
    "kick": "X-X-----X-XX--X-",
    "snare": "----X--X-X--X--X",
    "HH": "X---X-X---------",
    "crash": "X---------------",
    "id": "rock_011",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 96,
    "style": "ROCK",
    "role": "i",
    "kick": "X--X----X--X--X-",
    "snare": "----X-----------",
    "HH": "----------------",
    "crash": "X---------------",
    "id": "rock_012",
    "density": 0.109,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 86,
    "style": "ROCK",
    "role": "i",
    "kick": "X---------------",
    "snare": "---XXX----XX----",
    "HH": "----------------",
    "crash": "X---------------",
    "id": "rock_013",
    "density": 0.109,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 28,
    "style": "ROCK",
    "role": "i",
    "kick": "X---------------",
    "snare": "--------X-------",
    "HH": "---XXX-X-X-XXXX-",
    "crash": "X---------------",
    "id": "rock_014",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 5,
    "style": "ROCK",
    "role": "c",
    "kick": "X-------X--X----",
    "snare": "----X-------X---",
    "HH": "XX-XXX-XXX-XXX-X",
    "crash": "----------------",
    "id": "rock_015",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 141,
    "style": "ROCK",
    "role": "c",
    "kick": "-XX-X-X-X------X",
    "snare": "-XX-X-XX----X-X-",
    "HH": "------------X-X-",
    "crash": "----------------",
    "id": "rock_016",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 126,
    "style": "ROCK",
    "role": "c",
    "kick": "-X-X-X-XX-X-----",
    "snare": "X-----X-X---X---",
    "HH": "XXX-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "rock_017",
    "density": 0.297,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 132,
    "style": "ROCK",
    "role": "c",
    "kick": "X--XX-----------",
    "snare": "-X-XX---XX---X-X",
    "HH": "X-X-X-----------",
    "crash": "----------------",
    "id": "rock_018",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 78,
    "style": "ROCK",
    "role": "c",
    "kick": "X-X-----X-X----X",
    "snare": "-X--X--X-X-XX---",
    "HH": "X-X-X-X-X-X--X--",
    "crash": "----------------",
    "id": "rock_019",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 45,
    "style": "ROCK",
    "role": "c",
    "kick": "----------X-----",
    "snare": "XX---XX----X-X-X",
    "HH": "-------X---XX---",
    "crash": "----------------",
    "id": "rock_020",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 124,
    "style": "ROCK",
    "role": "c",
    "kick": "X---X---------XX",
    "snare": "--X----XX-XX----",
    "HH": "X-------X--X----",
    "crash": "----------------",
    "id": "rock_021",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 146,
    "style": "ROCK",
    "role": "c",
    "kick": "--X-------------",
    "snare": "-------------XX-",
    "HH": "-XX-XXX-XXX-X--X",
    "crash": "----------------",
    "id": "rock_022",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 15,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X---XX--X---X",
    "snare": "----X-------X---",
    "HH": "--XX--XX-XX---XX",
    "crash": "----------------",
    "id": "rock_023",
    "density": 0.25,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 127,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X-----XX--XX-",
    "snare": "-X--X-----------",
    "HH": "X-X-X--XX--XX--X",
    "crash": "----------------",
    "id": "rock_024",
    "density": 0.25,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 34,
    "style": "ROCK",
    "role": "c",
    "kick": "------------X---",
    "snare": "X-X-XX---X----X-",
    "HH": "------X------X--",
    "crash": "----------------",
    "id": "rock_025",
    "density": 0.141,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 135,
    "style": "ROCK",
    "role": "c",
    "kick": "--XX---XX-X----X",
    "snare": "----X--X--X-X---",
    "HH": "X-XXX-XXX-XXX-X-",
    "crash": "----------------",
    "id": "rock_026",
    "density": 0.328,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 30,
    "style": "ROCK",
    "role": "c",
    "kick": "---------X-X---X",
    "snare": "---X---X----XX--",
    "HH": "----X-----------",
    "crash": "----------------",
    "id": "rock_027",
    "density": 0.125,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 39,
    "style": "ROCK",
    "role": "c",
    "kick": "---X---X--X---X-",
    "snare": "-X--X-X-X--X--X-",
    "HH": "X---------------",
    "crash": "----------------",
    "id": "rock_028",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 52,
    "style": "ROCK",
    "role": "c",
    "kick": "-X----X-X----X--",
    "snare": "--X--X-X-X--X-X-",
    "HH": "---X------X-----",
    "crash": "----------------",
    "id": "rock_029",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 123,
    "style": "ROCK",
    "role": "c",
    "kick": "X-----X---------",
    "snare": "----X---X---X---",
    "HH": "X---X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "rock_030",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 150,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X------------",
    "snare": "--------XX--XXX-",
    "HH": "XXX-XXX----X---X",
    "crash": "----------------",
    "id": "rock_031",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 42,
    "style": "ROCK",
    "role": "c",
    "kick": "----X-------X---",
    "snare": "--XX--X-X-X----X",
    "HH": "X-----------X-X-",
    "crash": "----------------",
    "id": "rock_032",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 50,
    "style": "ROCK",
    "role": "c",
    "kick": "-------X--------",
    "snare": "X---X----X-XXX-X",
    "HH": "-X------X-------",
    "crash": "----------------",
    "id": "rock_033",
    "density": 0.156,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 7,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X-----XX--X-X",
    "snare": "----X-------X---",
    "HH": "XXXXXXXXXXXXXXXX",
    "crash": "----------------",
    "id": "rock_034",
    "density": 0.375,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 142,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X---XX-X-----",
    "snare": "-X--X-------XXX-",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "rock_035",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 95,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X--X----X--X-",
    "snare": "----X--XXX------",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_036",
    "density": 0.141,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 151,
    "style": "ROCK",
    "role": "c",
    "kick": "X-X------------X",
    "snare": "--------X-------",
    "HH": "XXX-XXX--XX-XXX-",
    "crash": "----------------",
    "id": "rock_037",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 67,
    "style": "ROCK",
    "role": "c",
    "kick": "--X-----X-X---X-",
    "snare": "--X-X-------X---",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_038",
    "density": 0.109,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 38,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X------------",
    "snare": "-X--X-X---------",
    "HH": "X--X--X-X--X--X-",
    "crash": "----------------",
    "id": "rock_039",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 75,
    "style": "ROCK",
    "role": "c",
    "kick": "X-------X-X---X-",
    "snare": "----X--X-X--X--X",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "rock_040",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 90,
    "style": "ROCK",
    "role": "c",
    "kick": "X---------------",
    "snare": "----X--XX-XXXX--",
    "HH": "---------X------",
    "crash": "----------------",
    "id": "rock_041",
    "density": 0.141,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 46,
    "style": "ROCK",
    "role": "c",
    "kick": "-X-X---X--------",
    "snare": "----X-X-X--XX--X",
    "HH": "--------X-X-----",
    "crash": "----------------",
    "id": "rock_042",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 148,
    "style": "ROCK",
    "role": "c",
    "kick": "X-X-------------",
    "snare": "-----X--XX----X-",
    "HH": "XXX-X-X---X-----",
    "crash": "----------------",
    "id": "rock_043",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 35,
    "style": "ROCK",
    "role": "c",
    "kick": "------X-X-------",
    "snare": "X---X-----------",
    "HH": "-X-------X--X---",
    "crash": "----------------",
    "id": "rock_044",
    "density": 0.109,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 58,
    "style": "ROCK",
    "role": "c",
    "kick": "X-------X-X-----",
    "snare": "----X-------X---",
    "HH": "XXXX-XXXXXXX-XXX",
    "crash": "----------------",
    "id": "rock_045",
    "density": 0.297,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 138,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X---XX-X-----",
    "snare": "-X--X--X--X-X---",
    "HH": "X-X-X-X-X-X-XX-X",
    "crash": "----------------",
    "id": "rock_046",
    "density": 0.297,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 89,
    "style": "ROCK",
    "role": "c",
    "kick": "X---X---X-X--X--",
    "snare": "--XX-----------X",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_047",
    "density": 0.125,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 114,
    "style": "ROCK",
    "role": "c",
    "kick": "X-X---X---X-----",
    "snare": "----X-------X-X-",
    "HH": "X-X-X---X---X---",
    "crash": "----------------",
    "id": "rock_048",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 51,
    "style": "ROCK",
    "role": "c",
    "kick": "X-X----X--X---X-",
    "snare": "-X--X-X-X--X--XX",
    "HH": "----X-------X---",
    "crash": "----------------",
    "id": "rock_049",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 145,
    "style": "ROCK",
    "role": "c",
    "kick": "----X-X-X-------",
    "snare": "-XX-X-X-X-------",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_050",
    "density": 0.125,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 129,
    "style": "ROCK",
    "role": "c",
    "kick": "---X----X-X-----",
    "snare": "-X--X--XX---X-XX",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "rock_051",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 108,
    "style": "ROCK",
    "role": "c",
    "kick": "X-X---X---------",
    "snare": "----X----X-XX---",
    "HH": "X-X-X-X-X-X-----",
    "crash": "----------------",
    "id": "rock_052",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 66,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X---XX--X---X",
    "snare": "----X-------X---",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_053",
    "density": 0.125,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 71,
    "style": "ROCK",
    "role": "c",
    "kick": "X-------X-X-----",
    "snare": "----X-------X---",
    "HH": "--X-X-X-----X-X-",
    "crash": "----------------",
    "id": "rock_054",
    "density": 0.156,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 88,
    "style": "ROCK",
    "role": "c",
    "kick": "X------X--------",
    "snare": "---XXX--XX------",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_055",
    "density": 0.109,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 101,
    "style": "ROCK",
    "role": "c",
    "kick": "X---------X-----",
    "snare": "----X-X-----X---",
    "HH": "----X---X-X-X---",
    "crash": "----------------",
    "id": "rock_056",
    "density": 0.141,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 117,
    "style": "ROCK",
    "role": "c",
    "kick": "------X---------",
    "snare": "----X-------XX--",
    "HH": "----X-X-XX--X---",
    "crash": "----------------",
    "id": "rock_057",
    "density": 0.141,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 49,
    "style": "ROCK",
    "role": "c",
    "kick": "-----------X--X-",
    "snare": "--X-XX---X--X---",
    "HH": "-------X--------",
    "crash": "----------------",
    "id": "rock_058",
    "density": 0.125,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 29,
    "style": "ROCK",
    "role": "c",
    "kick": "X---------X----X",
    "snare": "----X--X-X--X---",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_059",
    "density": 0.109,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 72,
    "style": "ROCK",
    "role": "c",
    "kick": "--------XX----X-",
    "snare": "----X-------X---",
    "HH": "----X---X---X---",
    "crash": "----------------",
    "id": "rock_060",
    "density": 0.125,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 54,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X----X-X-----",
    "snare": "X---X--X----X--X",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "rock_061",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 43,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X---X--X----X",
    "snare": "-X--X-X-X--X--XX",
    "HH": "------------X---",
    "crash": "----------------",
    "id": "rock_062",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 107,
    "style": "ROCK",
    "role": "c",
    "kick": "X-----X---X---X-",
    "snare": "----X-------X---",
    "HH": "X-X-X---X-X-X-X-",
    "crash": "----------------",
    "id": "rock_063",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 125,
    "style": "ROCK",
    "role": "c",
    "kick": "---X------X-----",
    "snare": "-X--X-------X---",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "rock_064",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 32,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X---X--X----X",
    "snare": "-X--X--XX--X--X-",
    "HH": "X---------------",
    "crash": "----------------",
    "id": "rock_065",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 92,
    "style": "ROCK",
    "role": "c",
    "kick": "X--X------------",
    "snare": "----XXXX--------",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_066",
    "density": 0.094,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 76,
    "style": "ROCK",
    "role": "f",
    "kick": "X-XX--X-X-------",
    "snare": "-X--X----XXXXXXX",
    "HH": "X-X-X-X-X-------",
    "crash": "----------------",
    "id": "rock_067",
    "density": 0.297,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 40,
    "style": "ROCK",
    "role": "f",
    "kick": "-X---X--X---X---",
    "snare": "X-X--XX--X--XX-X",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_068",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 47,
    "style": "ROCK",
    "role": "f",
    "kick": "X-X----X-X----X-",
    "snare": "-X-X--X-X--XXX-X",
    "HH": "----X------X----",
    "crash": "----------------",
    "id": "rock_069",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 116,
    "style": "ROCK",
    "role": "f",
    "kick": "X--------------X",
    "snare": "-XXXXXX--XXXX---",
    "HH": "X------X---X----",
    "crash": "----------------",
    "id": "rock_070",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 83,
    "style": "ROCK",
    "role": "f",
    "kick": "X--X--X---X--X--",
    "snare": "XX--XX--XX-XX-X-",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_071",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 31,
    "style": "ROCK",
    "role": "f",
    "kick": "-------X--------",
    "snare": "X--XX-X--X-XX-XX",
    "HH": "-X-X----X-------",
    "crash": "----------------",
    "id": "rock_072",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 140,
    "style": "ROCK",
    "role": "f",
    "kick": "X--XX---------XX",
    "snare": "-X-X----XX-XX-XX",
    "HH": "X-X-X-----------",
    "crash": "----------------",
    "id": "rock_073",
    "density": 0.25,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 81,
    "style": "ROCK",
    "role": "f",
    "kick": "X----X--X-------",
    "snare": "-X-X--XX-XXXXXXX",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_074",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 44,
    "style": "ROCK",
    "role": "f",
    "kick": "-X----X-X-------",
    "snare": "X-X----X-X--XXXX",
    "HH": "---X-XX---X-----",
    "crash": "----------------",
    "id": "rock_075",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 99,
    "style": "ROCK",
    "role": "f",
    "kick": "--X-X-X-X-X-X--X",
    "snare": "X-X--X-X-X-X-X-X",
    "HH": "----------------",
    "crash": "----------------",
    "id": "rock_076",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 144,
    "style": "ROCK",
    "role": "f",
    "kick": "-X-X------------",
    "snare": "X---X---XX-XX-XX",
    "HH": "X-X-X-----------",
    "crash": "----------------",
    "id": "rock_077",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 48,
    "style": "ROCK",
    "role": "f",
    "kick": "-X----X-X-------",
    "snare": "--XXX-XX-X-XXXXX",
    "HH": "----------X-----",
    "crash": "----------------",
    "id": "rock_078",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 246,
    "style": "DANCE",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "----XX-X-XX-XX-X",
    "HH": "------X-X-X-X-X-",
    "crash": "X---------------",
    "id": "dance_001",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 287,
    "style": "DANCE",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "----X-------X---",
    "HH": "X---X-XX--------",
    "crash": "X---------------",
    "id": "dance_002",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 226,
    "style": "DANCE",
    "role": "i",
    "kick": "X-X-X---X---X---",
    "snare": "----XX-X--X-X--X",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "X---------------",
    "id": "dance_003",
    "density": 0.312,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 257,
    "style": "DANCE",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "-XX-XX-X-XX-XX-X",
    "HH": "--X-X-X-X-X-X-XX",
    "crash": "X---------------",
    "id": "dance_004",
    "density": 0.359,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 271,
    "style": "DANCE",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "----X--X----X--X",
    "HH": "----X-------X---",
    "crash": "X---------------",
    "id": "dance_005",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 264,
    "style": "DANCE",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "----XX-X-XX-XX-X",
    "HH": "----X-------X---",
    "crash": "X---------------",
    "id": "dance_006",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 238,
    "style": "DANCE",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "-X--XX-X-XX-X--X",
    "HH": "--X-X-X-X-X-X-X-",
    "crash": "X---------------",
    "id": "dance_007",
    "density": 0.312,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 253,
    "style": "DANCE",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "----XX-X-XX-XX-X",
    "HH": "--X-X-X-X-XXX-X-",
    "crash": "X---------------",
    "id": "dance_008",
    "density": 0.328,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 261,
    "style": "DANCE",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "XX--XX-X-XX-XX-X",
    "HH": "--X-X-X-X-X-X-X-",
    "crash": "X---------------",
    "id": "dance_009",
    "density": 0.344,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 282,
    "style": "DANCE",
    "role": "i",
    "kick": "X---X---X---X---",
    "snare": "----X-------X--X",
    "HH": "----X-------X---",
    "crash": "X---------------",
    "id": "dance_010",
    "density": 0.156,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 155,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X---XX--X-X--",
    "snare": "----X-------X---",
    "HH": "XXXXXXXXXXXXXXXX",
    "crash": "----------------",
    "id": "dance_011",
    "density": 0.375,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 225,
    "style": "DANCE",
    "role": "c",
    "kick": "X-X-X-X-X-X-X-X-",
    "snare": "--X-XX-XXX-XXX--",
    "HH": "X---------------",
    "crash": "----------------",
    "id": "dance_012",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 219,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X--X--X--X-X-",
    "snare": "-XX-XX-XX-X----X",
    "HH": "X-X-X-X-XXXXXXX-",
    "crash": "----------------",
    "id": "dance_013",
    "density": 0.391,
    "energy": "high",
    "weight": 1
  },
  {
    "sourceLine": 165,
    "style": "DANCE",
    "role": "c",
    "kick": "--X-------X-----",
    "snare": "-X----X--X--X-XX",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "dance_014",
    "density": 0.25,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 255,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "X--XX--XXX--XX-X",
    "HH": "XX--XX-X-X-XX-X-",
    "crash": "----------------",
    "id": "dance_015",
    "density": 0.344,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 208,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X----X--X----",
    "snare": "-XX---XX----XXXX",
    "HH": "X--XXX--XXXX----",
    "crash": "----------------",
    "id": "dance_016",
    "density": 0.312,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 216,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X----X--X--X-",
    "snare": "-X-XXX---XX-X-XX",
    "HH": "X-X-X-XX-X-XXX--",
    "crash": "----------------",
    "id": "dance_017",
    "density": 0.359,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 242,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X--X",
    "snare": "-X--XX-X-XX-XX-X",
    "HH": "X-XXX-X-X-X-X-X-",
    "crash": "----------------",
    "id": "dance_018",
    "density": 0.359,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 187,
    "style": "DANCE",
    "role": "c",
    "kick": "X-X-----XX------",
    "snare": "----X--XX-X----X",
    "HH": "X---X---X---X---",
    "crash": "----------------",
    "id": "dance_019",
    "density": 0.203,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 291,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "--XX--------XXXX",
    "HH": "---X--------X---",
    "crash": "----------------",
    "id": "dance_020",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 245,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "-XXXXXXXXX------",
    "HH": "X---X------XXX--",
    "crash": "----------------",
    "id": "dance_021",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 214,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X--X-X--X----",
    "snare": "-XX-X-X--XX-X-X-",
    "HH": "X-XXXXXX--XXXXXX",
    "crash": "----------------",
    "id": "dance_022",
    "density": 0.406,
    "energy": "high",
    "weight": 1
  },
  {
    "sourceLine": 223,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X----X--X----",
    "snare": "--XXXX---XX--X--",
    "HH": "X-X-X-XXX-X-X-X-",
    "crash": "----------------",
    "id": "dance_023",
    "density": 0.312,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 205,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "----X------X----",
    "HH": "X-XX-XXXXXXX--X-",
    "crash": "----------------",
    "id": "dance_024",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 221,
    "style": "DANCE",
    "role": "c",
    "kick": "X-X-X-X-X-X---X-",
    "snare": "----XXXX----XX-X",
    "HH": "X-X-----X-XXX---",
    "crash": "----------------",
    "id": "dance_025",
    "density": 0.312,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 184,
    "style": "DANCE",
    "role": "c",
    "kick": "X-----X---------",
    "snare": "----X---X--XX-X-",
    "HH": "X-X-X-X-XXX-X-XX",
    "crash": "----------------",
    "id": "dance_026",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 218,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X--X-X--X----",
    "snare": "----XX------XXXX",
    "HH": "XXXXX-XXXXXXX-X-",
    "crash": "----------------",
    "id": "dance_027",
    "density": 0.375,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 252,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X------X-X--",
    "snare": "-XXX-X-XXXX-X---",
    "HH": "X---------------",
    "crash": "----------------",
    "id": "dance_028",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 275,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "-X--XX-X-X--X-XX",
    "HH": "----X-------X--X",
    "crash": "----------------",
    "id": "dance_029",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 210,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X----X--X----",
    "snare": "-X--X--X-XXXXX-X",
    "HH": "X-X-X-X---X-X-X-",
    "crash": "----------------",
    "id": "dance_030",
    "density": 0.312,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 186,
    "style": "DANCE",
    "role": "c",
    "kick": "------X---------",
    "snare": "--X--X--X-X-X-XX",
    "HH": "X---X---X---X---",
    "crash": "----------------",
    "id": "dance_031",
    "density": 0.188,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 178,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X-X-",
    "snare": "----X-------X---",
    "HH": "XXXXXXXXXXXXXXXX",
    "crash": "----------------",
    "id": "dance_032",
    "density": 0.359,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 227,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "----X-------X--X",
    "HH": "X-X-X-X-X-X-X-XX",
    "crash": "----------------",
    "id": "dance_033",
    "density": 0.25,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 229,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "-X--X--X-X-XXXXX",
    "HH": "X-X-X-X-X-X-----",
    "crash": "----------------",
    "id": "dance_034",
    "density": 0.297,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 298,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "---XXXX-XXX--X-X",
    "HH": "----X-------X---",
    "crash": "----------------",
    "id": "dance_035",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 281,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X-----------",
    "snare": "----X-----------",
    "HH": "----X------X----",
    "crash": "----------------",
    "id": "dance_036",
    "density": 0.078,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 183,
    "style": "DANCE",
    "role": "c",
    "kick": "X-----X-------X-",
    "snare": "----X-----X--X--",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "dance_037",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 239,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "--X-XX-X-XX-XX-X",
    "HH": "XXX-X-X-X-XXX-X-",
    "crash": "----------------",
    "id": "dance_038",
    "density": 0.359,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 290,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "-------XXXXXXXX-",
    "HH": "----X-------X---",
    "crash": "----------------",
    "id": "dance_039",
    "density": 0.219,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 156,
    "style": "DANCE",
    "role": "c",
    "kick": "X-------X-------",
    "snare": "----X-----X-----",
    "HH": "XXXX-XXXXX-XXXXX",
    "crash": "----------------",
    "id": "dance_040",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 209,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X----X--X----",
    "snare": "-X--XX-X----XXXX",
    "HH": "X-XX--X-XXXXX-X-",
    "crash": "----------------",
    "id": "dance_041",
    "density": 0.344,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 163,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X----X--X-X--",
    "snare": "----X-------X---",
    "HH": "------XXXXXX-XXX",
    "crash": "----------------",
    "id": "dance_042",
    "density": 0.25,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 166,
    "style": "DANCE",
    "role": "c",
    "kick": "X---------X-----",
    "snare": "----X--X-X----X-",
    "HH": "X---X---X---X---",
    "crash": "----------------",
    "id": "dance_043",
    "density": 0.156,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 230,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "-X--XX-X----X--X",
    "HH": "X-X-X-X-XXX-XXX-",
    "crash": "----------------",
    "id": "dance_044",
    "density": 0.312,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 254,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "-XX-XX-X-XX-X--X",
    "HH": "X-X-X-X-X-X-X-XX",
    "crash": "----------------",
    "id": "dance_045",
    "density": 0.344,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 301,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "---XXX-----XXXXX",
    "HH": "X---X-------X---",
    "crash": "----------------",
    "id": "dance_046",
    "density": 0.234,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 220,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X----X--X-X--",
    "snare": "X---X-------X---",
    "HH": "-XXX-XXXXXXX-XXX",
    "crash": "----------------",
    "id": "dance_047",
    "density": 0.328,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 248,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "XX--X--X-X--XX-X",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "dance_048",
    "density": 0.312,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 199,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "--------------X-",
    "HH": "XXXXXXXXXXXX----",
    "crash": "----------------",
    "id": "dance_049",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 231,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "----X--X-X--X-XX",
    "HH": "X-X-XXX-X-X-X-X-",
    "crash": "----------------",
    "id": "dance_050",
    "density": 0.297,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 237,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "----XX-X-XX-XXXX",
    "HH": "X-X-X-X-X-------",
    "crash": "----------------",
    "id": "dance_051",
    "density": 0.281,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 202,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "----X------X----",
    "HH": "XXXXXXXXXXX-XXXX",
    "crash": "----------------",
    "id": "dance_052",
    "density": 0.328,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 288,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X--X",
    "snare": "----X--X---XXXX-",
    "HH": "----------------",
    "crash": "----------------",
    "id": "dance_053",
    "density": 0.172,
    "energy": "low",
    "weight": 1
  },
  {
    "sourceLine": 185,
    "style": "DANCE",
    "role": "c",
    "kick": "--X-----X-X-----",
    "snare": "-X--X--X----X-XX",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "dance_054",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 164,
    "style": "DANCE",
    "role": "c",
    "kick": "X--X---XX--X-X-X",
    "snare": "----X-------X---",
    "HH": "XXXX-XXXXXXX-XXX",
    "crash": "----------------",
    "id": "dance_055",
    "density": 0.359,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 189,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X-X-",
    "snare": "------------X---",
    "HH": "XXXXXXXXXXX---XX",
    "crash": "----------------",
    "id": "dance_056",
    "density": 0.297,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 203,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "----X-------X---",
    "HH": "XXXX--XXXXXX-XXX",
    "crash": "----------------",
    "id": "dance_057",
    "density": 0.297,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 241,
    "style": "DANCE",
    "role": "c",
    "kick": "X---X---X---X---",
    "snare": "-XX-XX-X-X--XX-X",
    "HH": "X-X-X-X-X-XXX-X-",
    "crash": "----------------",
    "id": "dance_058",
    "density": 0.344,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 211,
    "style": "DANCE",
    "role": "f",
    "kick": "X--X----X--X----",
    "snare": "-XX-X--XXX-XXX-X",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "dance_059",
    "density": 0.344,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 215,
    "style": "DANCE",
    "role": "f",
    "kick": "X-X-X-X-X-X-X-X-",
    "snare": "--XXXXXX----XXXX",
    "HH": "XX----XXXXXX----",
    "crash": "----------------",
    "id": "dance_060",
    "density": 0.406,
    "energy": "high",
    "weight": 1
  },
  {
    "sourceLine": 263,
    "style": "DANCE",
    "role": "f",
    "kick": "X---X---X---X---",
    "snare": "-XXXXXXXXXXXX---",
    "HH": "X---------------",
    "crash": "----------------",
    "id": "dance_061",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 222,
    "style": "DANCE",
    "role": "f",
    "kick": "X-X---X-X-X-X-X-",
    "snare": "-XXXXX-X-XXXXXXX",
    "HH": "X---X-X-X-------",
    "crash": "----------------",
    "id": "dance_062",
    "density": 0.375,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 243,
    "style": "DANCE",
    "role": "f",
    "kick": "----X---X---X---",
    "snare": "-XX-XX-X-XX-XX-X",
    "HH": "X-XXX-X-X-XXX-XX",
    "crash": "----------------",
    "id": "dance_063",
    "density": 0.375,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 256,
    "style": "DANCE",
    "role": "f",
    "kick": "X---X---X---X---",
    "snare": "----XX-XXXXXXXXX",
    "HH": "X-X-X-X---------",
    "crash": "----------------",
    "id": "dance_064",
    "density": 0.297,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 212,
    "style": "DANCE",
    "role": "f",
    "kick": "X--X--X-X--X----",
    "snare": "-X-XXXXX-XXXXXXX",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "dance_065",
    "density": 0.406,
    "energy": "high",
    "weight": 1
  },
  {
    "sourceLine": 265,
    "style": "DANCE",
    "role": "f",
    "kick": "X---X---X---X---",
    "snare": "-XX-XX-XXX--XX-X",
    "HH": "----X-------X---",
    "crash": "----------------",
    "id": "dance_066",
    "density": 0.25,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 244,
    "style": "DANCE",
    "role": "f",
    "kick": "X---X---X---X---",
    "snare": "-XX-XX-X-XX-XX-X",
    "HH": "-X--X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "dance_067",
    "density": 0.328,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 299,
    "style": "DANCE",
    "role": "f",
    "kick": "X---X---X---X---",
    "snare": "---XX-XXXXXXXXX-",
    "HH": "----X-------X---",
    "crash": "----------------",
    "id": "dance_068",
    "density": 0.266,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 251,
    "style": "DANCE",
    "role": "f",
    "kick": "X---X---X---X---",
    "snare": "-XX-XX-XXX--XX-X",
    "HH": "X-X-X-X-X-X-X-X-",
    "crash": "----------------",
    "id": "dance_069",
    "density": 0.344,
    "energy": "medium",
    "weight": 1
  },
  {
    "sourceLine": 258,
    "style": "DANCE",
    "role": "f",
    "kick": "X---X---X---X---",
    "snare": "-XX-XX-X-XX-XX-X",
    "HH": "X-X-X-XXX-X-X-X-",
    "crash": "----------------",
    "id": "dance_070",
    "density": 0.359,
    "energy": "medium",
    "weight": 1
  }
];

  function normalizeLine(line) {
    return line.replace(/X/g, "x").replace(/-/g, ".");
  }

  function hitCount(line) {
    var count = 0;
    for (var i = 0; i < line.length; i++) {
      if (line.charAt(i) === "X") count++;
    }
    return count;
  }

  function patternDistance(a, b) {
    var fields = ["kick", "snare", "HH", "crash"];
    var distance = 0;
    for (var f = 0; f < fields.length; f++) {
      for (var i = 0; i < 16; i++) {
        if (a[fields[f]].charAt(i) !== b[fields[f]].charAt(i)) distance++;
      }
    }
    return distance;
  }

  function weightedChoice(items, weights) {
    var total = 0;
    for (var i = 0; i < weights.length; i++) total += weights[i];
    var value = Math.random() * total;
    for (var j = 0; j < items.length; j++) {
      value -= weights[j];
      if (value <= 0) return items[j];
    }
    return items[items.length - 1];
  }

  function RhythmPatternLibrary(patterns) {
    this.patterns = (patterns || PATTERNS).slice();
    this.validate();
  }

  RhythmPatternLibrary.prototype.validate = function () {
    var fields = ["kick", "snare", "HH", "crash"];
    var styles = {};
    for (var i = 0; i < this.patterns.length; i++) {
      var patterns = this.patterns[i];
      if (["i", "c", "f"].indexOf(patterns.role) === -1) {
        throw new Error("Ruolo rhythmic not valido: " + patterns.id);
      }
      for (var j = 0; j < fields.length; j++) {
        var value = patterns[fields[j]];
        if (typeof value !== "string" || value.length !== 16 || /[^X-]/.test(value)) {
          throw new Error("Pattern not valido: " + patterns.id + ", field " + fields[j]);
        }
      }
      if (hitCount(patterns.crash) > 1) {
        throw new Error("Crash multiplo not normalizzato: " + patterns.id);
      }
      styles[patterns.style] = styles[patterns.style] || { i: 0, c: 0, f: 0 };
      styles[patterns.style][patterns.role]++;
    }
    for (var style in styles) {
      if (!styles[style].i || !styles[style].c || !styles[style].f) {
        throw new Error("Style " + style + " does not cover every i/c/f role.");
      }
    }
  };

  RhythmPatternLibrary.prototype.getStyles = function () {
    var result = [];
    for (var i = 0; i < this.patterns.length; i++) {
      if (result.indexOf(this.patterns[i].style) === -1) result.push(this.patterns[i].style);
    }
    return result.sort();
  };

  RhythmPatternLibrary.prototype.getByRole = function (role, style) {
    return this.patterns.filter(function (patterns) {
      return patterns.role === role && patterns.style === style;
    });
  };

  RhythmPatternLibrary.prototype.targetDensity = function (sectionName, barIndex) {
    var targets = { intro: 0.22, verse: 0.28, chorus: 0.40, bridge: 0.33, outro: 0.25 };
    var target = targets[sectionName] !== undefined ? targets[sectionName] : 0.30;
    if (barIndex === 3) target += 0.04;
    return target;
  };

  RhythmPatternLibrary.prototype.choose = function (options) {
    var role = options.role;
    var style = options.style;
    var excludedIds = options.excludedIds || [];
    var selectedBars = options.selectedBars || [];
    var target = this.targetDensity(options.sectionName, options.barIndex);
    var pool = this.getByRole(role, style).filter(function (patterns) {
      return excludedIds.indexOf(patterns.id) === -1;
    });

    if (!pool.length) pool = this.getByRole(role, style);
    if (!pool.length) throw new Error("No patterns " + style + " per ruolo " + role + ".");

    var weights = pool.map(function (patterns) {
      var densityFit = Math.max(0.08, 1 - Math.abs(patterns.density - target) * 2.8);
      var diversity = 1;
      for (var i = 0; i < selectedBars.length; i++) {
        var distance = patternDistance(patterns, selectedBars[i]);
        if (distance < 10) diversity *= 0.12;
        else if (distance < 16) diversity *= 0.55;
      }
      return Math.max(0.01, patterns.weight * densityFit * diversity);
    });

    return weightedChoice(pool, weights);
  };

  RhythmPatternLibrary.prototype.buildPhrase = function (options) {
    options = options || {};
    var style = String(options.style || "POP").toUpperCase();
    var roles = options.roles || ["i", "c", "c", "f"];
    if (this.getStyles().indexOf(style) === -1) {
      throw new Error("Rhythm style is not available: " + style + ". Available: " + this.getStyles().join(", "));
    }

    var used = [];
    var bars = [];
    for (var i = 0; i < roles.length; i++) {
      var patterns = this.choose({
        role: roles[i],
        style: style,
        sectionName: options.sectionName || "verse",
        barIndex: i,
        excludedIds: used,
        selectedBars: bars
      });
      bars.push(patterns);
      used.push(patterns.id);
    }

    return {
      style: style,
      patternIds: bars.map(function (p) { return p.id; }),
      sourceLines: bars.map(function (p) { return p.sourceLine; }),
      roles: roles.slice(),
      densities: bars.map(function (p) { return p.density; }),
      energies: bars.map(function (p) { return p.energy; }),
      c: bars.map(function (p) { return normalizeLine(p.kick); }).join(""),
      r: bars.map(function (p) { return normalizeLine(p.snare); }).join(""),
      h: bars.map(function (p) { return normalizeLine(p.HH); }).join(""),
      k: bars.map(function (p) { return normalizeLine(p.crash); }).join("")
    };
  };

  RhythmPatternLibrary.DEFAULT_PATTERNS = PATTERNS.slice();
  global.RhythmPatternLibrary = RhythmPatternLibrary;
})(window);
