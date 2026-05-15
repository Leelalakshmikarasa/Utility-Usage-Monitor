using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<UtilityDevice> Devices { get; set; }
        public DbSet<UtilityConsumption> Consumptions { get; set; }

      protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    //  Tell EF that User.UserId is a key
    modelBuilder.Entity<User>()
        .HasAlternateKey(u => u.UserId);

    //  Complaint → User (string FK → string key)
    modelBuilder.Entity<Complaint>()
        .HasOne(c => c.User)
        .WithMany(u => u.Complaints)
        .HasForeignKey(c => c.UserId)
        .HasPrincipalKey(u => u.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    // UtilityDevice → User (string FK → string key)
    modelBuilder.Entity<UtilityDevice>()
        .HasOne(d => d.User)
        .WithMany(u => u.Devices)
        .HasForeignKey(d => d.UserId)
        .HasPrincipalKey(u => u.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    //  UtilityConsumption → User (NO ACTION to avoid cascade cycle)
    modelBuilder.Entity<UtilityConsumption>()
        .HasOne(c => c.User)
        .WithMany(u => u.Consumptions)
        .HasForeignKey(c => c.UserId)
        .HasPrincipalKey(u => u.UserId)
        .OnDelete(DeleteBehavior.NoAction);

    // UtilityConsumption → Device
    modelBuilder.Entity<UtilityConsumption>()
        .HasOne(c => c.UtilityDevice)
        .WithMany(d => d.Consumptions)
        .HasForeignKey(c => c.UtilityDeviceId)
        .OnDelete(DeleteBehavior.Cascade);

    // GLOBAL UNIQUE DEVICE NAME (THIS IS THE NEW PART)
    modelBuilder.Entity<UtilityDevice>()
        .HasIndex(d => d.DeviceName)
        .IsUnique();
}
    }
}