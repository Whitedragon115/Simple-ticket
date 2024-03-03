# \[ Simple-ticket \] By DragonCode 
[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&pause=1000&color=2F28F7&background=871EFF00&center=true&random=false&width=650&lines=Written+by+DragonCode;Best+Ticket+bot+%3F;I+really+love+Dragon!;My+favorite+movie+is+How+to+train+your+dragon;I+like+to+eat+cucumber;Cake+is+a+lie;I+am+from+Taiwan;I+don't+have+a+girl+friend%2C+wanna+be+mine+(if+you+are+girl%2C+I+am+not+gay))](https://git.io/typing-svg)
# Introduce

## Hello
### this is a Simple Ticket system for discord bot to help community manage there server, and there are many basic functions about this ticketbot, so let me introduce it

# Usage
- ### Node Version v.18
- ### Required package
```console
npm install
# this might take 90 sec
```
- ### Config
`1 config setting`

just fill everything in the config, and here is some cool stuff

>because I add a system that will automatically create channal and category **if there is no vaule in config**

so if you are tired of creating channel and category, just leave it as blank then run the bot

_<! role will not create automatically !>_



`2 how to add ticket category`

**first you copy below json setting**
```json
    {
      "category": "Other Request",
      "btnName": "Other",
      "btnEmoji": "⛓️",
      "categoryId": "",
      "openTicketDescription": {
        "description": "Briefly explain your request and provide relevant details.",
        "openping": false,
        "openasking": false,
        "modal": {
          "title": "",
          "placeholder": ""
        }
      }
    }
```
**now go to your config file and add it, for example**
### - Before
```json
"TicketCategory": [
    {
      "category": "Apply Media",
      "btnName": "Media",
      "btnEmoji": "⌨️",
      "categoryId": "1209056077950222376",
      "openTicketDescription": {
        "description": "Please provide details about the media type you're applying for and share your experience.",
        "openping": false,
        "openasking": true,
        "modal": {
          "title": "Your youtube channel link",
          "placeholder": "https://www.youtube.com/channel/UCtVd0c0tGXuTSbU5d8cSBUg"
        }
      }
    }
]
```
### - after
```json
"TicketCategory": [
    {
      "category": "Apply Media",
      "btnName": "Media",
      "btnEmoji": "⌨️",
      "categoryId": "",
      "openTicketDescription": {
        "description": "Please provide details about the media type you're applying for and share your experience.",
        "openping": false,
        "openasking": true,
        "modal": {
          "title": "Your youtube channel link",
          "placeholder": "https://www.youtube.com/channel/UCtVd0c0tGXuTSbU5d8cSBUg"
        }
      }
    },
    {
      "category": "New Category",
      "btnName": "new thing",
      "btnEmoji": "🪙",
      "categoryId": "",
      "openTicketDescription": {
        "description": "Describe your organization/project and the type of partnership you're seeking.",
        "openping": false,
        "openasking": true,
        "modal": {
          "title": "Your discord invite link",
          "placeholder": "https://discord.gg/invite"
        }
      }
    }
]
```
`3 .env setting`

just replace **BOT_TOKEN** to your bot token, so it should look like this
```env
TOKEN = MTIwNTkxMjkwNzM2MJEi49fr0Ng.GLj3i4.76fhwe94FW3jBwWK_bKb9okmMZ8tyJwAc
```
_don't wast your time trying login to the token, that is useless_
`4 config file rename`

this is last thing you need to do to finish your config setting
- rename `example.env` => `.env`
- rename `ExampleConfig.json` => `config.json`
# Support

**You can friend me in discord then dm me what problem you have**

My discord id: `whitedragon115`

# LICENSE
```ansi
MIT License

Copyright (c) 2024 Dragoncode

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```






