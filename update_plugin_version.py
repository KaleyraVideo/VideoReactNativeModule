import sys
import re
import json

version = ""

def replace(file, searchRegex, replaceExp):
  with open(file, "r+") as file:
      text = file.read()
      text = re.sub(searchRegex, replaceExp, text)
      file.seek(0, 0) # seek to beginning
      file.write(text)
      file.truncate() # get rid of any trailing characters

# read package.json variables to set on the plugin.xml
with open('package.json') as package_json:
    data = json.load(package_json)
    version = data['version']

semver_regex = r"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?"

# update android
replace("android/src/main/assets/kaleyra_video_wrapper_info.txt", semver_regex, version)

# update ios
replace("ios/PluginInfo/_KaleyraVideoHybridVersionInfo.swift", semver_regex, version)
