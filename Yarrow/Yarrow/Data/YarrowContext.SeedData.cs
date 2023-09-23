using Juniper.World.GIS;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

using System.Numerics;
using System.Text;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {

        private static readonly string[] orgs = new[]
        {
            "STM",
            "Anonymous"
        };

        // Email, FullName, Organization, isBootstrapUser, Roles
        private static readonly (string, string, string, bool, Role[])[] coreUsers = new[]
        {
            ("sean@seanmcbeth.com", "Sean T. McBeth", "STM", true, new []{ Role.Developer })
        };

        private static readonly string[] fileTags = new[]
        {
            "airplane",
            "ambient",
            "animals",
            "birds",
            "crowd",
            "helicopter",
            "model",
            "music",
            "nature",
            "photosphere",
            "sign",
            "street",
            "test",
            "thumbnail",
            "ui",
            "voiceover",
            "water"
        };

        // Protocol, Domain, Port, Enabled
        private static readonly (string, string, int, bool)[] webrtcs = new[]
        {
            ("stun", "vr.dlsdc.com", 8080, false),
            ("turn", "vr.dlsdc.com", 8080, false),
            ("turns", "vr.dlsdc.com", 8081, true)
        };

        public const string COTURN_SECRET = "CoTURNSecret";
        public const string ICE_TYPES = "ICETypes";
        // Key, Value
        private static readonly (string, string)[] settings = new[]
        {
            (COTURN_SECRET, "<value needed>"),
            (ICE_TYPES, "host,srflx,relay")
        };

        // Scenario Name, Language Name
        private static readonly (string, string)[] scenarios = new[]
        {
            ("Landing Page", "Meta")
        };

        public void SeedData(RoleManager<IdentityRole> roleMgr, UserManager<IdentityUser> userMgr, ILogger logger)
        {
            CreateRolesUsersAndOrgs(roleMgr, userMgr, logger).Wait();

            var admin = coreUsers.First().Item1;
            var adminId = userMgr.GetUsersInRoleAsync("Admin")
                .Result
                .OrderByDescending(u => u.Email == admin)
                .Select(u => u.Id)
                .FirstOrDefault();

            CreateLandingPage(adminId).Wait();
            CreateMetadata();
            SetScenarioOrigins();
            SaveChanges();
        }

        private void SetScenarioOrigins()
        {
            var scenarioStations = Stations
                .Include(s => s.Transform)
                    .ThenInclude(t => t.Scenario)
                .Where(s => s.Transform.Scenario.OriginLatitude == null
                    || s.Transform.Scenario.OriginLongitude == null
                    || s.Transform.Scenario.OriginAltitude == null)
                .AsEnumerable()
                .GroupBy(s => s.Transform.Scenario)
                .ToDictionary(g => g.Key, g => g.ToArray());

            foreach (var (scenario, stations) in scenarioStations)
            {
                Station minStation = null;
                Matrix4x4 stationMatrix = default;
                var minDisplacement = float.MaxValue;
                foreach (var station in stations)
                {
                    var matrix = station.Transform.Matrix.ToSystemMatrix4x4();
                    var disp = matrix.Translation.Length();
                    if (disp < minDisplacement)
                    {
                        minDisplacement = disp;
                        minStation = station;
                        stationMatrix = matrix;
                    }
                }

                if (minStation is not null)
                {
                    var latlng = new LatLngPoint(minStation.Latitude, minStation.Longitude, minStation.Altitude);
                    var utm = Juniper.Units.LatLng.ToUTM(latlng);
                    var utmOffset = stationMatrix.Translation;

                    utm = new UTMPoint(
                        utm.Easting - utmOffset.X,
                        utm.Northing + utmOffset.Z,
                        utm.Altitude - utmOffset.Y,
                        utm.Zone,
                        utm.Hemisphere);

                    latlng = Juniper.Units.UTM.ToLatLng(utm);

                    scenario.OriginLatitude = (float?)latlng.Lat;
                    scenario.OriginLongitude = (float?)latlng.Lng;
                    scenario.OriginAltitude = (float?)latlng.Alt;
                }
            }
        }

        private async Task CreateRolesUsersAndOrgs(RoleManager<IdentityRole> roleMgr, UserManager<IdentityUser> userMgr, ILogger logger)
        {
            var requiredUsers = new HashSet<string>(coreUsers.Select(e => e.Item1).Distinct());
            var idUsers = userMgr.Users
                .AsEnumerable()
                .Where(u => requiredUsers.Contains(u.Email))
                .GroupBy(u => u.Email)
                .ToDictionary(u => u.Key, u => u.First());

            var requiredRoles = new HashSet<string>(Enum.GetNames<Role>());
            var idRoles = roleMgr.Roles
                .AsEnumerable()
                .Where(r => requiredRoles.Contains(r.Name))
                .GroupBy(r => r.Name)
                .ToDictionary(r => r.Key, r => r.First());

            var orgs = Organizations.ToDictionary(org => org.Name, org => org);

            var userProfiles = UserProfiles
                .Include(u => u.User)
                .ToDictionary(k => k.User.Email);

            foreach (var roleName in requiredRoles)
            {
                if (!idRoles.ContainsKey(roleName))
                {
                    var idRole = new IdentityRole
                    {
                        Name = roleName,
                        NormalizedName = roleName.ToUpperInvariant()
                    };

                    await roleMgr.CreateAsync(idRole);
                    idRoles.Add(roleName, idRole);
                }
            }

            foreach (var orgName in YarrowContext.orgs)
            {
                if (!orgs.ContainsKey(orgName))
                {
                    var org = new Organization
                    {
                        Name = orgName
                    };

                    Organizations.Add(org);
                    orgs.Add(orgName, org);
                }
            }

            foreach (var (email, fullName, orgName, bootstrap, roles) in coreUsers)
            {
                if (!idUsers.TryGetValue(email, out var idUser))
                {
                    idUser = new IdentityUser
                    {
                        UserName = email,
                        NormalizedUserName = email.ToUpperInvariant(),
                        Email = email,
                        NormalizedEmail = email.ToUpperInvariant(),
                        EmailConfirmed = true,
                        LockoutEnabled = false
                    };

                    await userMgr.CreateAsync(idUser);
                    idUsers.Add(email, idUser);
                }

                if (userProfiles.TryGetValue(email, out UserProfile value))
                {
                    var profile = value;
                    profile.DisplayName ??= profile.FullName;
                    profile.Organization ??= orgs[orgName];
                }
                else
                {
                    var profile = new UserProfile
                    {
                        User = idUsers[email],
                        FullName = fullName,
                        DisplayName = fullName,
                        Organization = orgs[orgName]
                    };
                    UserProfiles.Add(profile);
                    userProfiles[email] = profile;
                }

                foreach (var profile in UserProfiles)
                {
                    profile.Timestamp ??= DateTime.UtcNow
                        .ToDateOnly()
                        .ToDateTime(TimeOnly.MinValue)
                        .AddDays(-1);
                }

                foreach (var role in roles)
                {
                    var roleName = role.ToString();
                    if (!idRoles.ContainsKey(roleName))
                    {
                        var idRole = new IdentityRole
                        {
                            Name = roleName,
                            NormalizedName = roleName.ToUpperInvariant()
                        };

                        await roleMgr.CreateAsync(idRole);
                        idRoles.Add(roleName, idRole);
                    }

                    var isInRole = await userMgr.IsInRoleAsync(idUser, roleName);
                    if (!isInRole)
                    {
                        await userMgr.AddToRoleAsync(idUser, roleName);
                    }
                }

                if (string.IsNullOrEmpty(idUser.PasswordHash) && bootstrap)
                {
                    var code = await userMgr.GeneratePasswordResetTokenAsync(idUser);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    logger.LogWarning("Core user {email} does not have a password. Reset it here: /Identity/Account/ResetPassword?code={code}", idUser.Email, code);
                }
            }

            foreach (var user in Users.Where(u => !requiredUsers.Contains(u.Email)))
            {
                var profile = await UserProfiles.SingleOrDefaultAsync(up => up.UserId == user.Id);
                if (profile is null)
                {
                    UserProfiles.Add(profile = new UserProfile
                    {
                        UserId = user.Id
                    });
                }

                profile.FullName ??= user.Email[..user.Email.IndexOf('@')];
                profile.DisplayName ??= profile.FullName;
                userProfiles[user.Email] = profile;
            }

            await SaveChangesAsync();
        }

        private async Task CreateLandingPage(string adminId)
        {
            var DLS = await Organizations.SingleAsync(o => o.Name == "DLS");
            var requiredLanguages = new HashSet<string>(scenarios.Select(s => s.Item2).Distinct());
            var languages = Languages
                .AsEnumerable()
                .Where(l => requiredLanguages.Contains(l.Name))
                .GroupBy(l => l.Name)
                .ToDictionary(l => l.Key, l => l.First());

            var requiredScenes = new HashSet<string>(scenarios.Select(s => s.Item1)).Distinct();
            var groups = ScenarioGroups
                .AsEnumerable()
                .Where(g => requiredScenes.Contains(g.Name))
                .GroupBy(g => g.Name)
                .ToDictionary(g => g.Key, g => g.First());

            foreach (var (scenarioName, languageName) in scenarios)
            {
                if (!languages.TryGetValue(languageName, out var language))
                {
                    Languages.Add(language = new Language
                    {
                        Name = languageName
                    });
                }

                if (!groups.TryGetValue(scenarioName, out var group))
                {
                    ScenarioGroups.Add(group = new ScenarioGroup
                    {
                        Language = language,
                        Name = scenarioName,
                        CreatedById = adminId
                    });

                    Scenarios.Add(new Scenario
                    {
                        ScenarioGroup = group,
                        CreatedById = adminId,
                        Transforms = new[]{
                            new Transform
                            {
                                Name = scenarioName,
                                Matrix = Matrix4x4.Identity.ToArray()
                            }
                        }
                    });
                }
            }
        }

        private void CreateMetadata()
        {
            foreach (var tag in fileTags)
            {
                if (!FileTags.Any(t => t.Name == tag))
                {
                    FileTags.Add(new FileTag
                    {
                        Name = tag
                    });
                }
            }

            foreach (var (name, value) in settings)
            {
                if (!Settings.Any(s => s.Name == name))
                {
                    Settings.Add(new Setting
                    {
                        Name = name,
                        Value = value
                    });
                }
            }

            foreach (var (protocol, host, port, enabled) in webrtcs)
            {
                if (!WebRtcs.Any(w => w.Protocol == protocol
                    && w.Host == host
                    && w.Port == port))
                {
                    WebRtcs.Add(new WebRtc
                    {
                        Protocol = protocol,
                        Host = host,
                        Port = port,
                        Enabled = enabled
                    });
                }
            }
        }
    }
}
