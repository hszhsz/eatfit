"""Recipe store — tries Supabase first, falls back to in-memory seed data.

This ensures:
- In production (with SUPABASE_URL + SUPABASE_SERVICE_KEY): recipes persist in DB
- In local dev (no service key): recipes still work from seed data
- Seeding is automatic: if Supabase recipes table is empty, seed it
"""
from __future__ import annotations

from app.data.recipes_seed import RECIPES
from app.schemas import IngredientItem, MealType, RecipeOut
from app.supabase_client import get_supabase

_fallback_store: list[RecipeOut] | None = None

# Food image URL mapping using Unsplash (free, no API key needed)
# Format: recipe name -> photo URL
_FOOD_IMAGES: dict[str, str] = {
    "燕麦鸡蛋牛奶碗": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop",
    "全麦鸡胸三明治": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
    "蔬菜豆浆杂粮粥": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
    "全麦吐司牛油果": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
    "虾仁蔬菜蒸蛋": "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=400&h=300&fit=crop",
    "烤红薯燕麦碗": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    "番茄鸡蛋燕麦杯": "https://images.unsplash.com/photo-1608032077018-c9aad9565d29?w=400&h=300&fit=crop",
    "鸡胸肉糙米饭": "https://images.unsplash.com/photo-1546069901-ba9d7c9e4c94?w=400&h=300&fit=crop",
    "全麦贝果三文鱼": "https://images.unsplash.com/photo-1607320305440-0f9f12e1c8c2?w=400&h=300&fit=crop",
    "南瓜籽酸奶碗": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    "甜玉米鸡胸沙拉": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    "番茄牛腩面": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    "蓝莓奇亚籽酸奶杯": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=300&fit=crop",
    "五谷杂粮饭": "https://images.unsplash.com/photo-1546069901-ba9d7c9e4c94?w=400&h=300&fit=crop",
    "番茄肉酱意面": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
    "清蒸鲈鱼": "https://images.unsplash.com/photo-1535140728325-a4d3707eee95?w=400&h=300&fit=crop",
    "鸡胸肉沙拉碗": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    "咖喱鸡块饭": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    "牛肉咖喱饭": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    "酸辣鸡丝凉面": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    "三杯鸡盖饭": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
    "青椒牛肉丝": "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=400&h=300&fit=crop",
    "红烧排骨饭": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
    "番茄龙利鱼": "https://images.unsplash.com/photo-1535140728325-a4d3707eee95?w=400&h=300&fit=crop",
    "牛排时蔬碗": "https://images.unsplash.com/photo-1546964124-0cce460f9ef0?w=400&h=300&fit=crop",
    "蒜蓉虾仁西兰花": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    "番茄炖牛腩": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
    "黑椒牛柳": "https://images.unsplash.com/photo-1546964124-0cce460f9ef0?w=400&h=300&fit=crop",
    "蒜蓉粉丝蒸扇贝": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop",
    "土豆泥鸡胸肉": "https://images.unsplash.com/photo-1546069901-ba9d7c9e4c94?w=400&h=300&fit=crop",
    "蜜汁烤鸡腿": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
    "椒盐大虾": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    "红烧鲫鱼": "https://images.unsplash.com/photo-1535140728325-a4d3707eee95?w=400&h=300&fit=crop",
    "鱼香茄子": "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=400&h=300&fit=crop",
    "冬瓜排骨汤": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
    "蒜蓉生菜": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    "凉拌黄瓜": "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=400&h=300&fit=crop",
    "清蒸鳕鱼": "https://images.unsplash.com/photo-1535140728325-a4d3707eee95?w=400&h=300&fit=crop",
    "罗宋汤": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
    "凉拌凉皮": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    "蒜香牛排粒": "https://images.unsplash.com/photo-1546964124-0cce460f9ef0?w=400&h=300&fit=crop",
    "日式茶碗蒸": "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=400&h=300&fit=crop",
    "水煮蛋": "https://images.unsplash.com/photo-1608032077018-c9aad9565d29?w=400&h=300&fit=crop",
    "香蕉牛奶奶昔": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=300&fit=crop",
    "烤玉米": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    "毛豆拌豆腐": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
    "香蕉燕麦饼干": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=300&fit=crop",
    "抹茶燕麦拿铁": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop",
    "黑巧克力坚果球": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=300&fit=crop",
    "鸡蛋羹": "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=400&h=300&fit=crop",
}


def _build_recipe(index: int, data: dict) -> RecipeOut:
    name = data["name"]
    return RecipeOut(
        id=index + 1,
        name=name,
        meal_type=MealType(data["meal_type"]),
        calories=data["calories"],
        protein_g=data["protein_g"],
        carbs_g=data["carbs_g"],
        fat_g=data["fat_g"],
        tags=data["tags"],
        allergens=data["allergens"],
        cook_minutes=data["cook_minutes"],
        ingredients=[IngredientItem(**i) for i in data["ingredients"]],
        steps=data["steps"],
        image_emoji=data.get("image_emoji", "🍽️"),
        image_url=_FOOD_IMAGES.get(name),
    )


def _get_fallback() -> list[RecipeOut]:
    global _fallback_store
    if _fallback_store is None:
        _fallback_store = [_build_recipe(i, r) for i, r in enumerate(RECIPES)]
    return _fallback_store


def get_all_recipes() -> list[RecipeOut]:
    """Return all recipes.

    Tries Supabase first; if unavailable or empty after seeding attempt,
    falls back to in-memory seed data.
    """
    sb = get_supabase()
    if sb.available:
        recipes = sb.fetch_recipes()
        if recipes:
            return recipes
        # Try to seed
        count = sb.seed_recipes_if_empty()
        if count > 0:
            return sb.fetch_recipes()
    # Fallback to in-memory
    return _get_fallback()
