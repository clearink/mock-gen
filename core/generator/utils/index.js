const findStructMap = require("./find_struct_map");
const flatGroupList = require("./flat_group_list");
const findUpdateGroup = require("./find_update_group");
const shouldGenerateApi = require("./should_generate_api");
const normalizeFilePath = require("./normalize_file_path");
const normalizeFileData = require("./normalize_file_data");
const createFolder = require("./create_folder");
const joiToString = require("./joi_to_string");
const normalizeTsData = require("./normalize_ts_data");
const normalizeRootName = require("./normalize_ts_data/normalize_root_name");

module.exports = {
  createFolder,
  joiToString,
  findStructMap,
  flatGroupList,
  findUpdateGroup,
  shouldGenerateApi,
  normalizeFilePath,
  normalizeFileData,
  normalizeTsData,
  normalizeRootName,
};
