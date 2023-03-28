#!/bin/bash

find . -type f -name "mod.ts" -delete

find . -type d -not -path '*/\.*' | while read -r dir; do
  if [ ! -f "${dir}/mod.ts" ]; then
    echo "Creating mod.ts in ${dir}"
    touch "${dir}/mod.ts"
    for file in "${dir}"/*.ts; do
      if [[ "${file}" != "${dir}/mod.ts" ]]; then
        filename="$(basename -- "${file}")"
        echo "export * from './${filename}';" >> "${dir}/mod.ts"
      fi
    done
    for subdir in "${dir}"/*; do
      if [[ -d "${subdir}" ]]; then
        subdir_name="$(basename -- "${subdir}")"
        echo "export * from './${subdir_name}/mod.ts';" >> "${dir}/mod.ts"
      fi
    done
  fi
done
