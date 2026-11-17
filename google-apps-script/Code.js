var SPREADSHEET_ID = "1yEW2fCOmHdTIExshkgFpa749Rlb68C9yEVvjtglxssc";

var INCLUDE_GROUP_PREFIX = false;

var STAGE_CONFIG = {
  1: {
    gid: 0,
    fallbackIndex: 0,
    isPlayoff: false,
    headers: [
      "Время прогноза",
      "Номер счета",
      "3-0",
      "3-1",
      "3-2",
      "0-3",
      "1-3",
      "2-3"
    ]
  },
  2: {
    gid: 1821488892,
    fallbackIndex: 1,
    isPlayoff: false,
    headers: [
      "Время прогноза",
      "Номер счета",
      "3-0",
      "3-1",
      "3-2",
      "0-3",
      "1-3",
      "2-3"
    ]
  },
  3: {
    gid: 362143462,
    fallbackIndex: 2,
    isPlayoff: false,
    headers: [
      "Время прогноза",
      "Номер счета",
      "3-0",
      "3-1",
      "3-2",
      "0-3",
      "1-3",
      "2-3"
    ]
  },
  4: {
    gid: 1951409102,
    fallbackIndex: 3,
    isPlayoff: true,
    headers: [
      "Время прогноза",
      "Номер счета",
      "1/4",
      "1/4",
      "1/4",
      "1/4",
      "1/2",
      "1/2",
      "3-е место",
      "Финал"
    ]
  }
};

function getSpreadsheet() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (err) {}

  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function findSheet(spreadsheet, config) {
  var sheets = spreadsheet.getSheets();

  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === config.gid) {
      return sheets[i];
    }
  }

  if (typeof config.fallbackIndex === "number" && sheets[config.fallbackIndex]) {
    return sheets[config.fallbackIndex];
  }

  return sheets[0];
}

function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight("bold");
    range.setBackground("#F3F3F3");
  }
}

function parseParameters(e) {
  if (!e) return {};

  var params = {};

  if (e.parameter) {
    for (var key in e.parameter) {
      params[key] = e.parameter[key];
    }
  }

  if (e.postData && e.postData.contents) {
    try {
      var json = JSON.parse(e.postData.contents);
      for (var jsonKey in json) {
        if (!params[jsonKey]) {
          params[jsonKey] = json[jsonKey];
        }
      }
    } catch (err) {}
  }

  return params;
}

function cleanGroupValue(value, label) {
  if (!value) return "";
  var regex = new RegExp("^" + label + ":\\s*", "i");
  var teamsOnly = value.replace(regex, "").trim();
  return INCLUDE_GROUP_PREFIX ? label + ": " + teamsOnly : teamsOnly;
}

function extractGroupPredictions(params) {
  var rawValues = [];
  for (var i = 1; i <= 8; i++) {
    var item = params["f" + i] || "";
    if (item) rawValues.push(item);
  }

  var groups = {
    "3-0": "",
    "3-1": "",
    "3-2": "",
    "0-3": "",
    "1-3": "",
    "2-3": ""
  };

  rawValues.forEach(function (val) {
    var match = val.match(/^(3-0|3-1|3-2|0-3|1-3|2-3):\s*(.*)$/);
    if (match) {
      var label = match[1];
      var teams = match[2];
      groups[label] = INCLUDE_GROUP_PREFIX ? label + ": " + teams : teams;
    }
  });

  if (!groups["3-0"] && params.f1) groups["3-0"] = cleanGroupValue(params.f1, "3-0");
  if (!groups["0-3"] && params.f2) groups["0-3"] = cleanGroupValue(params.f2, "0-3");
  if (!groups["3-1"] && params.f3) groups["3-1"] = cleanGroupValue(params.f3, "3-1");
  if (!groups["3-2"] && params.f4) groups["3-2"] = cleanGroupValue(params.f4, "3-2");
  if (!groups["1-3"] && params.f5) groups["1-3"] = cleanGroupValue(params.f5, "1-3");
  if (!groups["2-3"] && params.f6) groups["2-3"] = cleanGroupValue(params.f6, "2-3");

  return [
    groups["3-0"],
    groups["3-1"],
    groups["3-2"],
    groups["0-3"],
    groups["1-3"],
    groups["2-3"]
  ];
}

function extractPlayoffPredictions(params) {
  return [
    params.f1 || "",
    params.f2 || "",
    params.f3 || "",
    params.f4 || "",
    params.f5 || "",
    params.f6 || "",
    params.f8 || "",
    params.f7 || ""
  ];
}

function buildRow(config, params) {
  var time = params.time || Utilities.formatDate(new Date(), "Europe/Minsk", "dd.MM.yyyy (HH:mm)");
  var accountNumber = params.account_number || "";

  var predictions = config.isPlayoff
    ? extractPlayoffPredictions(params)
    : extractGroupPredictions(params);

  return [time, accountNumber].concat(predictions);
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doGet() {
  return createJsonResponse({
    status: "ok",
    message: "Google Apps Script endpoint is active."
  });
}

function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    lock.waitLock(15000);

    var params = parseParameters(e);
    var step = parseInt(params.step, 10) || 1;
    var config = STAGE_CONFIG[step] || STAGE_CONFIG[1];

    var spreadsheet = getSpreadsheet();
    var sheet = findSheet(spreadsheet, config);

    if (!sheet) {
      throw new Error("Вкладка для этапа " + step + " не найдена");
    }

    ensureHeaders(sheet, config.headers);

    var row = buildRow(config, params);
    sheet.appendRow(row);

    return createJsonResponse({
      status: "success",
      step: step,
      sheetId: sheet.getSheetId(),
      sheetName: sheet.getName(),
      row: sheet.getLastRow()
    });
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

function testStage1() {
  var res = doPost({
    parameter: {
      step: "1",
      account_number: "123456789",
      time: "24.11.2026 (12:00)",
      f1: "3-0: Ninjas in Pyjamas, HEROIC",
      f2: "0-3: Eternal Fire, Liquid",
      f3: "3-1: M80, Imperial, BC.Game",
      f4: "3-2: FlyQuest, PARIVISION, FaZe",
      f5: "1-3: 100 Thieves, 9z, DENDELE",
      f6: "2-3: Wildcard, Chinggis Warriors, Lynn Vision"
    }
  });
  Logger.log(res.getContent());
}

function testStage2() {
  var res = doPost({
    parameter: {
      step: "2",
      account_number: "223456789",
      time: "28.11.2026 (12:00)",
      f1: "3-0: Ninjas in Pyjamas, HEROIC",
      f2: "0-3: Eternal Fire, Liquid",
      f3: "3-1: M80, Imperial, BC.Game",
      f4: "3-2: FlyQuest, PARIVISION, FaZe",
      f5: "1-3: 100 Thieves, 9z, DENDELE",
      f6: "2-3: Wildcard, Chinggis Warriors, Lynn Vision"
    }
  });
  Logger.log(res.getContent());
}

function testStage3() {
  var res = doPost({
    parameter: {
      step: "3",
      account_number: "323456789",
      time: "02.12.2026 (12:00)",
      f1: "3-0: Ninjas in Pyjamas, HEROIC",
      f2: "0-3: Eternal Fire, Liquid",
      f3: "3-1: M80, Imperial, BC.Game",
      f4: "3-2: FlyQuest, PARIVISION, FaZe",
      f5: "1-3: 100 Thieves, 9z, DENDELE",
      f6: "2-3: Wildcard, Chinggis Warriors, Lynn Vision"
    }
  });
  Logger.log(res.getContent());
}

function testPlayoff() {
  var res = doPost({
    parameter: {
      step: "4",
      account_number: "423456789",
      time: "10.12.2026 (12:00)",
      f1: "Team Spirit 2:0 Team Falcons",
      f2: "FaZe Clan 2:1 MOUZ",
      f3: "Natus Vincere 2:0 Virtus.pro",
      f4: "Vitality 2:1 G2",
      f5: "Team Spirit 2:0 FaZe Clan",
      f6: "Natus Vincere 2:1 Vitality",
      f7: "Team Spirit 3:1 Natus Vincere",
      f8: "FaZe Clan 2:1 Vitality"
    }
  });
  Logger.log(res.getContent());
}
