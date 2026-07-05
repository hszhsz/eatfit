import SwiftUI

struct ProfileFormView: View {
    @Binding var draft: ProfileDraft

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            CardSection(title: "基础信息") {
                TextField("姓名", text: $draft.name)
                    .textInputAutocapitalization(.never)
                Picker("性别", selection: $draft.gender) {
                    ForEach(Gender.allCases) { gender in
                        Text(gender.label).tag(gender)
                    }
                }
                .pickerStyle(.segmented)
                HStack {
                    TextField("年龄", text: $draft.age)
                        .keyboardType(.numberPad)
                    TextField("身高 cm", text: $draft.heightCm)
                        .keyboardType(.decimalPad)
                    TextField("体重 kg", text: $draft.weightKg)
                        .keyboardType(.decimalPad)
                }
                TextField("体脂率 %（选填）", text: $draft.bodyFatPct)
                    .keyboardType(.decimalPad)
            }

            CardSection(title: "目标与活动") {
                Picker("目标", selection: $draft.goal) {
                    ForEach(Goal.allCases) { goal in
                        Text(goal.label).tag(goal)
                    }
                }
                .pickerStyle(.segmented)

                Picker("活动水平", selection: $draft.activityLevel) {
                    ForEach(ActivityLevel.allCases) { level in
                        Text(level.label).tag(level)
                    }
                }
            }

            CardSection(title: "饮食偏好") {
                Toggle("偏好素食方案", isOn: $draft.vegetarian)
                TagWrapView(items: ProfileDraft.commonAllergens, selected: draft.allergens) { item in
                    if draft.allergens.contains(item) {
                        draft.allergens.remove(item)
                    } else {
                        draft.allergens.insert(item)
                    }
                }
            }
        }
    }
}
