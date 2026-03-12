using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace U3P4_NETCORE.Controllers
{
    public class CarritoController : Controller
    {
        // Lista estática como "base de datos" en memoria
        private static List<(int Id, string Nombre, double Precio)> _carrito = new();
        private static int _nextId = 1;

        public IActionResult Index() => View(_carrito);

        public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(string nombre, double precio)
        {
            if (!string.IsNullOrWhiteSpace(nombre) && precio > 0)
            {
                _carrito.Add((_nextId++, nombre, precio));
            }
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var item = _carrito.FirstOrDefault(p => p.Id == id);
            if (item == default) return NotFound();
            return View(item);
        }

        [HttpPost, ActionName("Delete")]
        public IActionResult DeleteConfirmed(int id)
        {
            _carrito.RemoveAll(p => p.Id == id);
            return RedirectToAction("Index");
        }
    }
}