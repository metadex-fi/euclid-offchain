#!/bin/bash

mkdir -p test_logs
rm test_logs/logs_*.txt
N=100
pipe=$(mktemp -u)
mkfifo $pipe

update_counts() {
    while true; do
        # Count running jobs
        total_running=$(jobs -r | wc -l)

        # Break if no jobs are running
        if [ "$total_running" -eq 0 ]; then
            break
        fi

        # Extract the number of passed tests from all files and sum them up
        total_passed=$(grep -hoE '([0-9]+) passed' test_logs/*.txt 2>/dev/null | awk '{ sum += $1 } END { print sum }')

        # Print out the results
        echo "Running: $total_running, Passed: $total_passed"

        sleep 1
    done
}

# Start the monitoring function in the background
update_counts &

# Start the parallel test processes
for i in $(seq 1 $N); do
    deno task test > test_logs/logs_$i.txt 2>&1 &
done

# Wait for all the background jobs (tests) to complete
wait

# Clean up the named pipe
rm -f $pipe

# Print the summary of failed tests
failed_indices=$(grep -lE '([1-9][0-9]*) failed' test_logs/*.txt 2>/dev/null | sed -n 's/test_logs\/logs_\([0-9]*\).txt/\1/p' | tr '\n' ',' | sed 's/,$//')

# If any tests failed, print their indices
if [ ! -z "$failed_indices" ]; then
    echo "Failed test indices: $failed_indices"
fi

grep "does not validate" test_logs/*.txt