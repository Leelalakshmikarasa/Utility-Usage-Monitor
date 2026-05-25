using Microsoft.EntityFrameworkCore;

using backend.Data;

using backend.Repos;

using Microsoft.AspNetCore.Authentication.JwtBearer;

using Microsoft.IdentityModel.Tokens;

using System.Text;

using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

//  SQL Server DB

builder.Services.AddDbContext<AppDbContext>(options =>

    options.UseSqlServer(

        builder.Configuration.GetConnectionString("DefaultConnection")

    ));

//  Services

builder.Services.AddScoped<AuthService>();

builder.Services.AddScoped<IUserRepository, EFUserRepository>();

builder.Services.AddScoped<IComplaintRepository, EFComplaintRepository>();

builder.Services.AddScoped<IDeviceRepository, EFDeviceRepository>();

builder.Services.AddScoped<IConsumptionRepository, EFConsumptionRepository>();


builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>

{

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme

    {

        Name = "Authorization",

        Type = SecuritySchemeType.Http,

        Scheme = "Bearer",

        BearerFormat = "JWT",

        In = ParameterLocation.Header,

        Description = "JWT Authentication using Beare scheme"

    });

    options.AddSecurityRequirement(doc => new OpenApiSecurityRequirement

    {

        { new OpenApiSecuritySchemeReference("Bearer", doc), new List<string>() }

    });

});

// JWT Authentication

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

    .AddJwtBearer(options =>

    {

        var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);

        options.TokenValidationParameters = new TokenValidationParameters

        {

            ValidateIssuer = true,

            ValidateAudience = true,

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(key)

        };

    });

//Authorization

builder.Services.AddAuthorization();

// CORS

builder.Services.AddCors(options =>

{

    options.AddPolicy("AllowAll",

        policy => policy.AllowAnyOrigin()

                        .AllowAnyMethod()

                        .AllowAnyHeader());

});

builder.Services.AddControllers()

    .AddJsonOptions(options =>

    {

        options.JsonSerializerOptions.Converters.Add(

            new System.Text.Json.Serialization.JsonStringEnumConverter());

    });


var app = builder.Build();

// Middlewares order (VERY IMPORTANT)

// Serve SPA static files (React build) from wwwroot

app.UseCors("AllowAll");

app.UseDefaultFiles();

app.UseStaticFiles();

app.UseSwagger();








app.UseSwaggerUI();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

// If a request does not match an API route, serve the SPA index.html

app.MapFallbackToFile("index.html");

app.Run();