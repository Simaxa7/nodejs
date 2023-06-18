process.stdin.on("data", data => {
    data = data.toString().split('').reverse().join('')
    process.stdout.write(data + "\n"+ "\n")
})
