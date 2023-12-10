#!/bin/bash

# Print the summary of passed tests
passed_indices=$(for file in test_logs/*.txt; do 
    if tail -n 10 "$file" | grep -qE '([1-9][0-9]*) passed'; then 
        basename "$file" .txt | sed -n 's/logs_\([0-9]*\)/\1/p'; 
    fi 
done | tr '\n' ',' | sed 's/,$//')


# If any tests passed, print their indices
if [ ! -z "$passed_indices" ]; then
    echo "Passed test indices: $passed_indices"
fi

failed_indices=$(for file in test_logs/*.txt; do 
    if tail -n 10 "$file" | grep -qE '([1-9][0-9]*) failed'; then 
        basename "$file" .txt | sed -n 's/logs_\([0-9]*\)/\1/p'; 
    fi 
done | tr '\n' ',' | sed 's/,$//')


# If any tests failed, print their indices
if [ ! -z "$failed_indices" ]; then
    echo "Failed test indices: $failed_indices"
fi