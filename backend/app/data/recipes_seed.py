"""Seed recipe library for EatFit.

Each recipe carries nutrition per serving, ingredient list (with grams and a
shopping category), cooking steps, tags, and allergen flags. The data is
intentionally hand-curated so the demo works fully offline without any
external API or LLM call.
"""
from __future__ import annotations

# category constants for grocery grouping
VEG = "蔬菜水果"
MEAT = "肉蛋水产"
STAPLE = "主食粮油"
DAIRY = "奶制品"
OTHER = "调料其他"

RECIPES = [
    # ---------------- BREAKFAST ----------------
    {
        "name": "燕麦鸡蛋牛奶碗",
        "meal_type": "breakfast",
        "calories": 380, "protein_g": 22, "carbs_g": 45, "fat_g": 12,
        "tags": ["高蛋白", "快手", "增肌", "保持"],
        "allergens": ["蛋", "奶", "麸质"],
        "cook_minutes": 8,
        "image_emoji": "🥣",
        "ingredients": [
            {"name": "即食燕麦", "amount_g": 50, "category": STAPLE},
            {"name": "鸡蛋", "amount_g": 50, "category": MEAT},
            {"name": "牛奶", "amount_g": 200, "category": DAIRY},
            {"name": "蓝莓", "amount_g": 30, "category": VEG},
        ],
        "steps": [
            "燕麦倒入碗中,加入 200ml 牛奶。",
            "微波炉高火加热 2 分钟,或小锅煮沸 1 分钟。",
            "另起锅水煮蛋 7 分钟,剥壳对半切开放在燕麦上。",
            "撒上蓝莓即可,可按口味加少许蜂蜜。",
        ],
    },
    {
        "name": "全麦鸡胸三明治",
        "meal_type": "breakfast",
        "calories": 420, "protein_g": 35, "carbs_g": 40, "fat_g": 12,
        "tags": ["高蛋白", "减脂", "增肌"],
        "allergens": ["蛋", "麸质"],
        "cook_minutes": 12,
        "image_emoji": "🥪",
        "ingredients": [
            {"name": "全麦面包", "amount_g": 70, "category": STAPLE},
            {"name": "鸡胸肉", "amount_g": 100, "category": MEAT},
            {"name": "生菜", "amount_g": 30, "category": VEG},
            {"name": "番茄", "amount_g": 40, "category": VEG},
            {"name": "鸡蛋", "amount_g": 50, "category": MEAT},
        ],
        "steps": [
            "鸡胸肉切薄片,用少许盐和黑胡椒腌 5 分钟。",
            "平底锅少油煎熟鸡胸肉,煎一个荷包蛋。",
            "面包略微烤热,铺生菜、番茄片、鸡胸肉和鸡蛋。",
            "对半切开即可食用。",
        ],
    },
    {
        "name": "蔬菜豆浆杂粮粥",
        "meal_type": "breakfast",
        "calories": 300, "protein_g": 12, "carbs_g": 50, "fat_g": 6,
        "tags": ["低脂", "素食", "减脂", "调理"],
        "allergens": ["大豆"],
        "cook_minutes": 15,
        "image_emoji": "🥛",
        "ingredients": [
            {"name": "杂粮米", "amount_g": 50, "category": STAPLE},
            {"name": "无糖豆浆", "amount_g": 250, "category": DAIRY},
            {"name": "菠菜", "amount_g": 50, "category": VEG},
        ],
        "steps": [
            "杂粮米提前浸泡 30 分钟。",
            "加水煮成粥约 12 分钟。",
            "菠菜焯水切碎,拌入粥中。",
            "搭配一杯热豆浆即可。",
        ],
    },
    # ---------------- LUNCH ----------------
    {
        "name": "香煎鸡胸糙米饭",
        "meal_type": "lunch",
        "calories": 560, "protein_g": 45, "carbs_g": 60, "fat_g": 14,
        "tags": ["高蛋白", "增肌", "减脂"],
        "allergens": [],
        "cook_minutes": 20,
        "image_emoji": "🍚",
        "ingredients": [
            {"name": "鸡胸肉", "amount_g": 150, "category": MEAT},
            {"name": "糙米", "amount_g": 80, "category": STAPLE},
            {"name": "西兰花", "amount_g": 100, "category": VEG},
            {"name": "胡萝卜", "amount_g": 50, "category": VEG},
            {"name": "橄榄油", "amount_g": 8, "category": OTHER},
        ],
        "steps": [
            "糙米淘洗后按 1:1.3 加水煮饭。",
            "鸡胸肉用盐、黑胡椒、少许橄榄油腌 10 分钟。",
            "平底锅中火每面煎 4-5 分钟至熟透,切片。",
            "西兰花、胡萝卜焯水 3 分钟,与鸡胸肉、糙米饭装盘。",
        ],
    },
    {
        "name": "番茄牛肉意面",
        "meal_type": "lunch",
        "calories": 620, "protein_g": 38, "carbs_g": 70, "fat_g": 18,
        "tags": ["高蛋白", "增肌", "保持"],
        "allergens": ["麸质"],
        "cook_minutes": 25,
        "image_emoji": "🍝",
        "ingredients": [
            {"name": "意大利面", "amount_g": 90, "category": STAPLE},
            {"name": "牛肉末", "amount_g": 120, "category": MEAT},
            {"name": "番茄", "amount_g": 150, "category": VEG},
            {"name": "洋葱", "amount_g": 40, "category": VEG},
            {"name": "橄榄油", "amount_g": 10, "category": OTHER},
        ],
        "steps": [
            "意面下锅煮 9 分钟,捞出备用。",
            "橄榄油炒香洋葱末,加入牛肉末炒散。",
            "番茄切丁下锅,加少许盐熬成酱汁。",
            "倒入意面拌匀收汁即可。",
        ],
    },
    {
        "name": "清蒸鲈鱼时蔬饭",
        "meal_type": "lunch",
        "calories": 520, "protein_g": 42, "carbs_g": 55, "fat_g": 12,
        "tags": ["高蛋白", "低脂", "减脂", "调理"],
        "allergens": ["鱼"],
        "cook_minutes": 22,
        "image_emoji": "🐟",
        "ingredients": [
            {"name": "鲈鱼", "amount_g": 180, "category": MEAT},
            {"name": "米饭", "amount_g": 80, "category": STAPLE},
            {"name": "芦笋", "amount_g": 80, "category": VEG},
            {"name": "姜", "amount_g": 10, "category": OTHER},
            {"name": "蒸鱼豉油", "amount_g": 10, "category": OTHER},
        ],
        "steps": [
            "鲈鱼洗净,铺姜丝,大火蒸 10 分钟。",
            "淋上蒸鱼豉油和少许热油。",
            "芦笋焯水 2 分钟。",
            "配米饭一起食用。",
        ],
    },
    {
        "name": "鹰嘴豆藜麦沙拉",
        "meal_type": "lunch",
        "calories": 450, "protein_g": 18, "carbs_g": 58, "fat_g": 16,
        "tags": ["素食", "低脂", "减脂", "调理"],
        "allergens": [],
        "cook_minutes": 18,
        "image_emoji": "🥗",
        "ingredients": [
            {"name": "藜麦", "amount_g": 60, "category": STAPLE},
            {"name": "鹰嘴豆", "amount_g": 80, "category": STAPLE},
            {"name": "黄瓜", "amount_g": 60, "category": VEG},
            {"name": "圣女果", "amount_g": 60, "category": VEG},
            {"name": "橄榄油", "amount_g": 10, "category": OTHER},
        ],
        "steps": [
            "藜麦煮 15 分钟至透明,沥干放凉。",
            "鹰嘴豆煮熟(或用即食罐头)。",
            "黄瓜、圣女果切块。",
            "全部混合,淋橄榄油、柠檬汁、盐拌匀。",
        ],
    },
    # ---------------- DINNER ----------------
    {
        "name": "虾仁西兰花炒饭",
        "meal_type": "dinner",
        "calories": 480, "protein_g": 32, "carbs_g": 55, "fat_g": 12,
        "tags": ["高蛋白", "减脂", "快手"],
        "allergens": ["虾", "蛋"],
        "cook_minutes": 15,
        "image_emoji": "🍤",
        "ingredients": [
            {"name": "虾仁", "amount_g": 120, "category": MEAT},
            {"name": "米饭", "amount_g": 100, "category": STAPLE},
            {"name": "西兰花", "amount_g": 80, "category": VEG},
            {"name": "鸡蛋", "amount_g": 50, "category": MEAT},
            {"name": "橄榄油", "amount_g": 8, "category": OTHER},
        ],
        "steps": [
            "虾仁去虾线,用少许料酒腌一下。",
            "热锅少油炒散鸡蛋盛出。",
            "下虾仁炒至变色,加西兰花碎翻炒。",
            "倒入米饭和鸡蛋,加盐翻炒均匀。",
        ],
    },
    {
        "name": "豆腐蔬菜煲",
        "meal_type": "dinner",
        "calories": 360, "protein_g": 22, "carbs_g": 30, "fat_g": 16,
        "tags": ["素食", "低脂", "减脂", "调理"],
        "allergens": ["大豆"],
        "cook_minutes": 18,
        "image_emoji": "🍲",
        "ingredients": [
            {"name": "北豆腐", "amount_g": 200, "category": MEAT},
            {"name": "香菇", "amount_g": 60, "category": VEG},
            {"name": "白菜", "amount_g": 100, "category": VEG},
            {"name": "胡萝卜", "amount_g": 40, "category": VEG},
            {"name": "生抽", "amount_g": 10, "category": OTHER},
        ],
        "steps": [
            "豆腐切块,香菇白菜切片。",
            "砂锅加少许油,放豆腐略煎。",
            "加入蔬菜和适量水,加生抽调味。",
            "中火煮 10 分钟至入味。",
        ],
    },
    {
        "name": "黑椒牛柳芦笋",
        "meal_type": "dinner",
        "calories": 540, "protein_g": 44, "carbs_g": 35, "fat_g": 22,
        "tags": ["高蛋白", "增肌"],
        "allergens": [],
        "cook_minutes": 20,
        "image_emoji": "🥩",
        "ingredients": [
            {"name": "牛里脊", "amount_g": 160, "category": MEAT},
            {"name": "芦笋", "amount_g": 100, "category": VEG},
            {"name": "彩椒", "amount_g": 60, "category": VEG},
            {"name": "黑胡椒酱", "amount_g": 15, "category": OTHER},
            {"name": "米饭", "amount_g": 60, "category": STAPLE},
        ],
        "steps": [
            "牛里脊切条,用黑胡椒、少许油腌 10 分钟。",
            "大火快炒牛柳至变色盛出。",
            "下芦笋、彩椒翻炒,回锅牛柳。",
            "加黑胡椒酱炒匀,配少量米饭。",
        ],
    },
    # ---------------- SNACK ----------------
    {
        "name": "希腊酸奶坚果杯",
        "meal_type": "snack",
        "calories": 220, "protein_g": 15, "carbs_g": 18, "fat_g": 10,
        "tags": ["高蛋白", "增肌", "保持", "快手"],
        "allergens": ["奶", "坚果"],
        "cook_minutes": 3,
        "image_emoji": "🍶",
        "ingredients": [
            {"name": "希腊酸奶", "amount_g": 150, "category": DAIRY},
            {"name": "混合坚果", "amount_g": 15, "category": OTHER},
            {"name": "香蕉", "amount_g": 50, "category": VEG},
        ],
        "steps": [
            "酸奶倒入杯中。",
            "香蕉切片铺上。",
            "撒上混合坚果即可。",
        ],
    },
    {
        "name": "水煮蛋+苹果",
        "meal_type": "snack",
        "calories": 160, "protein_g": 8, "carbs_g": 20, "fat_g": 6,
        "tags": ["低脂", "减脂", "快手", "调理"],
        "allergens": ["蛋"],
        "cook_minutes": 8,
        "image_emoji": "🥚",
        "ingredients": [
            {"name": "鸡蛋", "amount_g": 50, "category": MEAT},
            {"name": "苹果", "amount_g": 150, "category": VEG},
        ],
        "steps": [
            "鸡蛋冷水下锅煮 8 分钟。",
            "苹果洗净切块。",
            "作为加餐食用。",
        ],
    },
    {
        "name": "乳清蛋白奶昔",
        "meal_type": "snack",
        "calories": 200, "protein_g": 25, "carbs_g": 12, "fat_g": 4,
        "tags": ["高蛋白", "增肌", "快手"],
        "allergens": ["奶"],
        "cook_minutes": 2,
        "image_emoji": "🥤",
        "ingredients": [
            {"name": "乳清蛋白粉", "amount_g": 30, "category": OTHER},
            {"name": "牛奶", "amount_g": 250, "category": DAIRY},
        ],
        "steps": [
            "蛋白粉加入摇杯。",
            "倒入牛奶。",
            "摇匀后饮用,适合训练后补充。",
        ],
    },
]
