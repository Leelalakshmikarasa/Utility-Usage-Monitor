using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Repos;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/consumption")]
    [Authorize]
    public class ConsumptionController : ControllerBase
    {
        private readonly IConsumptionRepository _consumption;
        private readonly IDeviceRepository _devices;

        public ConsumptionController(IConsumptionRepository consumption, IDeviceRepository devices)
        {
            _consumption = consumption;
            _devices = devices;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var consumptions = _consumption.GetAll().ToList();
            return Ok(consumptions);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var c = _consumption.GetById(id);
            if (c == null) return NotFound();
            return Ok(c);
        }

        [HttpPost]
        public IActionResult Add(UtilityConsumption consumption)
        {
            _consumption.Add(consumption);
            return Ok(consumption);
        }

        [HttpPut]
        public IActionResult Update(UtilityConsumption consumption)
        {
            _consumption.Update(consumption);
            return Ok(consumption);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var c = _consumption.GetById(id);
            if (c == null) return NotFound();
            _consumption.Delete(c);
            return Ok();
        }
    }
}