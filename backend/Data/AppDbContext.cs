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

            // ✅ User.UserId as alternate key
            modelBuilder.Entity<User>()
                .HasAlternateKey(u => u.UserId);

            // ✅ Complaint → User (CASCADE OK)
            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.User)
                .WithMany(u => u.Complaints)
                .HasForeignKey(c => c.UserId)
                .HasPrincipalKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Device → User (CASCADE OK)
            modelBuilder.Entity<UtilityDevice>()
                .HasOne(d => d.User)
                .WithMany(u => u.Devices)
                .HasForeignKey(d => d.UserId)
                .HasPrincipalKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Complaint → Device (NO CASCADE ✅ FIX)
            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.Device)
                .WithMany(d => d.Complaints)
                .HasForeignKey(c => c.DeviceId)
                .OnDelete(DeleteBehavior.Restrict); 

            // ✅ Consumption → User (NO ACTION)
            modelBuilder.Entity<UtilityConsumption>()
                .HasOne(c => c.User)
                .WithMany(u => u.Consumptions)
                .HasForeignKey(c => c.UserId)
                .HasPrincipalKey(u => u.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // ✅ Consumption → Device (CASCADE OK)
            modelBuilder.Entity<UtilityConsumption>()
                .HasOne(c => c.UtilityDevice)
                .WithMany(d => d.Consumptions)
                .HasForeignKey(c => c.UtilityDeviceId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Unique Device Name
            modelBuilder.Entity<UtilityDevice>()
                .HasIndex(d => d.DeviceName)
                .IsUnique();
        }
    }
}