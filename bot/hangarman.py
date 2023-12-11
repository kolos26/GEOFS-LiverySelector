#LiverySelector Hangarman

import discord
from discord.ext import commands
from urllib.request import urlopen
import os

TOKEN = os.environ["DISCORD_TOKEN"]
INTENTS = discord.Intents(messages = True, message_content = True)

bot = commands.Bot(command_prefix='/', intents=INTENTS)

@bot.event
async def on_ready():
    print(f'{bot.user.name} has connected to Discord!')

@bot.command(name='count_liveries')
async def count_liveries(ctx):

    response = str(urlopen("https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/livery.json").read()).count('"texture":')
    await ctx.send(f"Currently `{response}` liveries are accessible via LiverySelector.")

bot.run(TOKEN)