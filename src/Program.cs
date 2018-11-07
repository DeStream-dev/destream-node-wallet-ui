using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DeStream.Features.GUI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            var host= WebHost.CreateDefaultBuilder(args).ConfigureLogging((hostCntxt, logBuilder)=>
            {
                logBuilder.AddConsole();
                logBuilder.AddDebug();
            })
                .UseStartup<Startup>();
            string wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            if(!Directory.Exists(wwwRootPath))
            {
                wwwRootPath=Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location),"wwwroot");
                if (Directory.Exists(wwwRootPath))
                    host.UseWebRoot(wwwRootPath);
            }
            return host;
                 

        }
    }
}
