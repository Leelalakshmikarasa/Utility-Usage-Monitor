using backend.Models;
using backend.DTOs;

namespace backend.Repos
{
    public interface IConsumptionRepository
    {
        List<UtilityConsumption> GetByUser(string userId);
        List<UtilityConsumption> GetAll();
         List<UtilityConsumption> GetByAddress(string address);
        List<ConsumptionByAddressDTO> GetTotalByAddress();
    }



    
}