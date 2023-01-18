import { stdin, stdout } from 'node:process';

stdin.on("data", data => {
    data = [...data.toString()].reverse().join('')
    stdout.write(data + "\n"+ "\n")
})
